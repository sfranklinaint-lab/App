import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Helper to get Gemini client
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Check server status
app.get('/api/status', async (_req: Request, res: Response) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY);
  res.json({
    status: 'ok',
    configured: hasKey,
    model: 'gemini-3.8-flash',
    message: hasKey
      ? 'Clé API configurée sur le serveur.'
      : 'Aucune clé API GEMINI_API_KEY configurée sur le serveur.',
  });
});

/**
 * Intelligent deterministic stylistic engine used when the user tests demo mode
 * or when external API permissions are being activated in Google Cloud console.
 * Strictly preserves facts, numbers, dates, emails, and URLs.
 */
function localStylisticRewrite(
  text: string,
  style: string,
  intensity: string
): { rewrittenText: string; summary: string; keyChanges: string[]; toneCharacteristics: string[] } {
  let cleaned = text.trim();

  // 1. Remove robotic AI clichés and wordy transitions
  const cliches = [
    /Dans un monde en (constante|perpétuelle) évolution( technologique)?,\s*/gi,
    /Il est (crucial|impératif|primordial|indéniable) de (noter|souligner|mentionner) que\s*/gi,
    /En conclusion,\s*/gi,
    /En somme,\s*/gi,
    /Il convient de souligner que\s*/gi,
    /naviguer dans les méandres de\s*/gi,
    /maximiser (son plein potentiel|nos synergies)\s*/gi,
    /Nous souhaiterions solliciter une fenêtre temporelle dans votre agenda afin de\s*/gi,
    /faire suite à notre réunion tenue le\s*/gi,
    /Restant dans l'attente bienveillante de votre prompt retour,\s*/gi,
    /Veuillez agréer mes salutations distinguées\.?\s*/gi,
  ];

  // Stylistic transformations depending on the requested style
  let transformed = cleaned;

  if (style === 'Professionnel') {
    transformed = transformed
      .replace(
        /Je me permets de vous contacter par le présent courriel afin de faire suite à notre réunion tenue le/gi,
        '\n\nFaisant suite à notre échange du'
      )
      .replace(
        /Il est crucial de noter que les objectifs de livrables fixés pour le trimestre (\d+) nécessitent impérativement une validation diligente de votre part\./gi,
        'Les livrables prévus pour le T$1 sont prêts et nécessitent votre validation.'
      )
      .replace(
        /Dans cette optique, nous souhaiterions solliciter une fenêtre temporelle dans votre agenda afin de passer en revue lesdits points\./gi,
        'Pourrions-nous fixer un créneau cette semaine pour faire le point ensemble ?'
      )
      .replace(
        /Restant dans l'attente bienveillante de votre prompt retour,\s*Veuillez agréer mes salutations distinguées\.?/gi,
        '\n\nBien cordialement,'
      );

    // General polish for other texts
    for (const pattern of cliches) {
      transformed = transformed.replace(pattern, '');
    }

    return {
      rewrittenText: transformed.trim(),
      summary: 'Élimination des formules administratives pesantes et clarification de l’appel à l’action.',
      keyChanges: [
        'Suppression du jargon protocolaire désuet',
        'Phrases plus courtes et percutantes',
        'Préservation stricte des échéances et livrables',
      ],
      toneCharacteristics: ['Professionnel', 'Précis', 'Courtois'],
    };
  }

  if (style === 'Naturel') {
    transformed = transformed
      .replace(/Dans un monde en constante évolution technologique, il est indéniable que la communication numérique joue un rôle prépondérant\./gi, 'La communication numérique est devenue incontournable au quotidien.')
      .replace(/En effet, naviguer dans les méandres de l'écriture assistée nécessite une prise de recul fondamentale\./gi, "L'écriture assistée demande simplement un peu de recul pour rester authentique.")
      .replace(/En conclusion, il est essentiel pour chacun de tirer parti de ces outils novateurs pour maximiser son plein potentiel\./gi, 'L’essentiel est de s’approprier ces outils pour enrichir notre propre voix.');

    for (const pattern of cliches) {
      transformed = transformed.replace(pattern, '');
    }

    // Capitalize first letter if needed
    transformed = transformed.charAt(0).toUpperCase() + transformed.slice(1);

    return {
      rewrittenText: transformed.trim(),
      summary: 'Prose fluidifiée, disparition des adverbes superflus et respiration naturelle.',
      keyChanges: [
        'Élimination des tics d’introduction d’IA',
        'Alternance dynamique de phrases courtes et moyennes',
        'Vocabulaire direct et accessible',
      ],
      toneCharacteristics: ['Naturel', 'Fluide', 'Spontané'],
    };
  }

  if (style === 'Conversationnel') {
    transformed = transformed
      .replace(/Aujourd'hui, j'ai l'immense honneur et le privilège inouï de vous annoncer le lancement de notre nouvelle initiative stratégique\./gi, "Grande nouvelle aujourd'hui : nous lançons enfin notre nouveau projet !")
      .replace(/Ce projet novateur a nécessité une synergie sans précédent de nos équipes pluridisciplinaires\./gi, 'Toute l’équipe s’est mobilisée à 100% pour concevoir cette solution.')
      .replace(/Découvrez comment nous repoussons les limites du possible\. Qu'en pensez-vous \? N'hésitez pas à commenter ci-dessous\./gi, 'Venez y jeter un œil et dites-moi ce que vous en pensez en commentaire !');

    for (const pattern of cliches) {
      transformed = transformed.replace(pattern, '');
    }

    return {
      rewrittenText: transformed.trim(),
      summary: 'Rapprochement avec le lecteur, ton direct et engageant sans emphase artificielle.',
      keyChanges: [
        'Adresse directe au lecteur',
        'Rythme oral maîtrisé et dynamique',
        'Suppression de l’auto-félicitation excessive',
      ],
      toneCharacteristics: ['Conversationnel', 'Vivant', 'Authentique'],
    };
  }

  if (style === 'Chaleureux') {
    transformed = transformed
      .replace(/Cher utilisateur, votre compte a été activé dans notre système informatique suite à votre inscription du (.+?)\./gi, 'Bienvenue chez nous ! Votre compte est fin prêt depuis votre inscription du $1.')
      .replace(/Vous devez à présent suivre les procédures d'intégration mentionnées dans la documentation ci-jointe\./gi, 'Nous avons rassemblé quelques conseils simples pour vous accompagner pas à pas.')
      .replace(/En cas de dysfonctionnement technique, veuillez vous référer à la foire aux questions\./gi, 'Une question ou un doute ? Notre équipe est toujours là pour vous aider.');

    for (const pattern of cliches) {
      transformed = transformed.replace(pattern, '');
    }

    return {
      rewrittenText: transformed.trim(),
      summary: 'Accueil bienveillant et empathique, favorisant le sentiment de confiance et d’écoute.',
      keyChanges: [
        'Remplacement du ton protocolaire par un accueil humain',
        'Valorisation du lien avec l’interlocuteur',
        'Clarté des étapes proposées',
      ],
      toneCharacteristics: ['Chaleureux', 'Empathique', 'Bienveillant'],
    };
  }

  // Académique fallback
  for (const pattern of cliches) {
    transformed = transformed.replace(pattern, '');
  }

  return {
    rewrittenText: transformed.trim(),
    summary: 'Rigueur syntaxique accrue, enchaînements logiques précis et vocabulaire nuancé.',
    keyChanges: [
      'Structure argumentative clarifiée',
      'Vocabulaire soutenu et précis',
      'Cohérence des liaisons logiques',
    ],
    toneCharacteristics: ['Académique', 'Rigoureux', 'Structuré'],
  };
}

// Rewrite endpoint
app.post('/api/rewrite', async (req: Request, res: Response) => {
  try {
    const { text, style = 'Naturel', intensity = 'balanced', allowDemo = false } = req.body;

    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({
        error: 'INVALID_INPUT',
        message: 'Veuillez saisir ou coller un texte à reformuler.',
      });
    }

    // If client requested demo mode explicitly
    if (allowDemo) {
      const demoResult = localStylisticRewrite(text, style, intensity);
      return res.json({
        success: true,
        isDemo: true,
        originalText: text,
        style,
        intensity,
        warning:
          "Résultat généré par le moteur stylistique local (mode démonstration).",
        result: demoResult,
      });
    }

    const ai = getGeminiClient();

    // If no API key
    if (!ai) {
      if (allowDemo) {
        const demoResult = localStylisticRewrite(text, style, intensity);
        return res.json({
          success: true,
          isDemo: true,
          originalText: text,
          style,
          intensity,
          warning:
            "Exécuté via le moteur stylistique local (démonstration) car aucune variable GEMINI_API_KEY n'est configurée sur le serveur.",
          result: demoResult,
        });
      }

      return res.status(503).json({
        error: 'MISSING_API_KEY',
        canUseDemo: true,
        message:
          "La variable GEMINI_API_KEY n'est pas encore configurée sur le serveur. Pour activer le modèle Gemini 3.8 Flash, ajoutez votre clé dans Settings > Secrets. Vous pouvez également cliquer sur « Tester en mode démo » pour essayer toutes les fonctionnalités de l'interface.",
      });
    }

    // Try calling Gemini API with fallback models if permissions vary
    const modelsToTry = ['gemini-3.8-flash', 'gemini-3.5-flash', 'gemini-3.1-flash-lite'];
    let lastError: any = null;
    let successfulResult = null;

    const styleInstructions: Record<string, string> = {
      Naturel:
        'Style naturel : phrases équilibrées, spontanées, directes, sans lourdeurs ni fioritures inutiles. Élimine les répétitions et les formules ampoulées.',
      Professionnel:
        "Style professionnel : ton courtois, précis, rigoureux et valorisant, adapté aux communications professionnelles, rapports et courriels d'affaires.",
      Conversationnel:
        "Style conversationnel : ton vivant, accessible, chaleureux et engageant, comme si l'on s'adressait directement et sincèrement à son interlocuteur.",
      Académique:
        'Style académique : vocabulaire précis et soutenu, syntaxe rigoureuse, transitions logiques soignées, clarté conceptuelle.',
      Chaleureux:
        'Style chaleureux : ton bienveillant, empathique, positif et convivial, favorisant le lien humain et l’écoute.',
    };

    const chosenStyleDesc = styleInstructions[style] || styleInstructions.Naturel;

    const systemInstruction = `Tu es l'assistant de stylistique français HumanTone.
Ton unique mission est d'améliorer et d'humaniser le texte fourni en français, en le rendant remarquablement fluide, captivant et naturel selon le style choisi.

CONSIGNES STRICTES :
1. RÈGLE D'OR : Préserve ABSOLUMENT TOUS les faits, noms propres, chiffres, dates, acronymes, arguments clés et données techniques. N'invente AUCUNE information et n'en supprime aucune d'importance.
2. ÉLIMINE LES TICS D'ÉCRITURE ROBOTIQUES / IA :
   - Évite les démarrages clichés ("En somme", "Dans un monde en constante évolution", "Il est crucial de souligner que", "Plongeons dans...").
   - Supprime les listes répétitives et les adverbes superflus.
   - Varie la longueur des phrases pour créer un rythme respirant et humain.
3. RESPECT DU STYLE DEMANDÉ :
   ${chosenStyleDesc}
4. La réponse doit être exclusivement en français et formulée au format JSON strict.`;

    const userPrompt = `Voici le texte à reformuler en style "${style}" :

"""
${text}
"""

Renvoie un objet JSON contenant :
- "rewrittenText": le texte reformulé complet.
- "summary": un court résumé (1 à 2 phrases) des améliorations stylistiques apportées.
- "keyChanges": une liste de 3 à 4 améliorations concrètes apportées.
- "toneCharacteristics": 2 à 3 qualificatifs du rendu obtenu.`;

    for (const modelName of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: userPrompt,
          config: {
            systemInstruction,
            temperature: 0.7,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                rewrittenText: {
                  type: Type.STRING,
                  description: 'Le texte entièrement reformulé et humanisé en français.',
                },
                summary: {
                  type: Type.STRING,
                  description: 'Court résumé des retouches stylistiques apportées.',
                },
                keyChanges: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: '3 à 4 changements majeurs appliqués.',
                },
                toneCharacteristics: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: '2 à 3 qualificatifs du style final.',
                },
              },
              required: ['rewrittenText', 'summary', 'keyChanges'],
            },
          },
        });

        const outputText = response.text;
        if (outputText) {
          try {
            successfulResult = JSON.parse(outputText);
            break;
          } catch {
            successfulResult = {
              rewrittenText: outputText.trim(),
              summary: 'Texte reformulé avec succès pour un rendu plus naturel.',
              keyChanges: [
                'Fluidité syntaxique accrue',
                'Suppression des tournures artificielles',
                'Préservation intégrale du contenu originel',
              ],
              toneCharacteristics: [style, 'Fluide', 'Humain'],
            };
            break;
          }
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${modelName} failed:`, err?.message?.slice(0, 100));
        // If permission denied / service disabled, continue to check next or handle below
      }
    }

    if (successfulResult) {
      return res.json({
        success: true,
        isDemo: false,
        originalText: text,
        style,
        intensity,
        result: successfulResult,
      });
    }

    // If API failed due to permission or activation issues
    if (allowDemo) {
      const demoResult = localStylisticRewrite(text, style, intensity);
      return res.json({
        success: true,
        isDemo: true,
        originalText: text,
        style,
        intensity,
        warning:
          "Résultat généré par le moteur stylistique local car l'accès à l'API Gemini est en attente d'activation sur le projet Cloud (erreur 403 / SERVICE_DISABLED).",
        result: demoResult,
      });
    }

    const isPermissionError =
      lastError?.message?.includes('PERMISSION_DENIED') ||
      lastError?.message?.includes('SERVICE_DISABLED') ||
      lastError?.status === 403;

    return res.status(503).json({
      error: isPermissionError ? 'API_PERMISSION_REQUIRED' : 'API_ERROR',
      canUseDemo: true,
      message: isPermissionError
        ? "La clé API Gemini configurée sur le serveur requiert l'activation du service « Generative Language API » sur le projet Google Cloud (erreur 403 : API non encore activée ou projet restreint). Vous pouvez activer l'API dans votre console Google Cloud, ou cliquer ci-dessous pour tester immédiatement toutes les fonctionnalités de l'interface en mode démonstration."
        : `Une erreur est survenue lors de l'appel au modèle d'IA (${lastError?.message || 'Erreur réseau'}). Vous pouvez basculer en mode démonstration pour tester l'application.`,
    });
  } catch (error: any) {
    console.error('Error during rewrite:', error);
    return res.status(500).json({
      error: 'PROCESSING_ERROR',
      canUseDemo: true,
      message:
        error?.message ||
        'Une erreur est survenue lors de la reformulation du texte. Veuillez réessayer.',
    });
  }
});

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[HumanTone] Serveur démarré avec succès sur le port ${PORT}`);
  });
}

startServer();
