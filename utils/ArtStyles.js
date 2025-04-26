const artStylePrompts = [
    {
      id: "gogh",
      koreanName: "고흐",
      englishName: "Vincent van Gogh",
      prompt: "Transform this image into Vincent van Gogh's iconic artistic style. Apply his distinctive thick, textured brushstrokes with bold, swirling patterns that create movement across the entire composition. Use vibrant, emotionally expressive colors with striking contrasts between complementary hues - rich blues against golden yellows, deep greens against fiery oranges. Incorporate the characteristic impasto technique where paint appears to rise from the canvas, creating tangible texture. Emphasize emotional depth through exaggerated forms and dramatic perspective. Add defined outlines around key elements while maintaining the flowing, organic energy that defines van Gogh's work. Capture the unique interplay of light and shadow that gives his paintings their mesmerizing, almost pulsating quality, whether depicting serene landscapes, intimate portraits, or everyday objects."
    },
    {
      id: "monet",
      koreanName: "모네",
      englishName: "Claude Monet",
      prompt: "Transform this image with loose, visible brushstrokes to capture fleeting effects of light and atmosphere. Create a vibrant palette with subtle color variations to show how light transforms color. Emphasize the play of light and reflections, especially on water surfaces. Dissolve solid forms into shimmering fields of color and light. Maintain an atmosphere of spontaneity and freshness as if painted outdoors. Focus on atmospheric effects rather than precise details. Include natural beauty, modern leisure, and the changing qualities of light. Capture an ephemeral, dreamlike quality."
    },
    {
      id: "chagall",
      koreanName: "샤갈",
      englishName: "Marc Chagall",
      prompt: "Convert this image using vibrant, luminous colors. Include floating, flying figures that defy gravity and conventional perspective. Mix reality with fantasy elements like animals playing musical instruments or people flying above villages. Create a childlike whimsy combined with folklore and religious symbolism. Arrange figures in dreamlike, non-linear compositions. Add cultural elements and symbols from Eastern European folk art. Layer transparent colors for a stained-glass effect. Blend joy with melancholy and memory with imagination."
    },
    {
      id: "AlphonseMucha",
      koreanName: "알폰스 무하",
      englishName: "Alphonse Mucha",
      prompt: "Transform this image by Alphonse Mucha style. Art Nouveau. Beatuiful."
    },
    {
      id: "picasso",
      koreanName: "피카소",
      englishName: "Pablo Picasso",
      prompt: "Transform this image by Pablo Picasso style. Cubism. Beatuiful."
    //   prompt: "Render this image by deconstructing the subject into geometric shapes and planes that show multiple perspectives simultaneously. Fragment and reassemble forms to create a complex, multi-viewpoint representation. Create flat, interlocking planes that suggest three-dimensionality without traditional perspective. Include characteristic elements like musical instruments, bottles, or newspaper fragments if appropriate. Balance analytical deconstruction with synthetic reconstruction. Show angular facial features influenced by African masks. Analyze form rather than imitating appearance."
    },
    {
        id: "giotto",
        koreanName: "조토",
        englishName: "Giotto di Bondone",
        prompt: "Transform this image in the style of Giotto di Bondone, the father of Renaissance painting. Use solemn, dignified figures with weightiness and volume, breaking from Byzantine flatness. Employ a rich but limited medieval color palette dominated by ultramarine blue, vermilion, and gold. Create clear spatial relationships and simplified architectural elements. Give figures emotionally expressive faces and naturalistic poses that convey human drama. Include halos and religious iconography as appropriate. Maintain the formal composition and devotional gravity of 14th-century Italian religious art. Add subtle shadows to suggest three-dimensionality while keeping a somewhat flattened perspective."
    },
    {
      id: "renoir",
      koreanName: "르누아르",
      englishName: "Pierre-Auguste Renoir",
      prompt: "Transform this image using soft, feathery brushstrokes that create a sense of warmth and intimacy. Create a luminous palette with pearly pinks, soft blues, and warm golds that capture the glow of sunlight on skin. Depict figures with rounded, sensuous forms and rosy complexions. Emphasize joy, pleasure, and the beauty of everyday life. Capture dappled light filtering through foliage or reflecting off water. Add a sense of spontaneous movement and casual elegance. Paint with visible but blended brushwork that creates a vibrating surface texture. Include an atmosphere of leisure and social pleasure."
    },
    {
      id: "munch",
      koreanName: "뭉크",
      englishName: "Edvard Munch",
      prompt: "Transform this image using flowing, undulating lines that create a sense of psychological tension and movement. Create bold, non-naturalistic colors to convey emotional states rather than realistic representation. Simplify forms to their emotional essence with elongated, distorted figures. Emphasize feelings of anxiety, alienation, and existential dread. Apply paint with visible brushstrokes in swirling patterns. Use strong, unnatural contrasts and juxtapositions of complementary colors. Include a symbolic representation of inner turmoil with a brooding, haunting atmosphere. Capture deep psychological intensity and raw emotional power."
    },
    {
      id: "seurat",
      koreanName: "쇠라",
      englishName: "Georges Seurat",
      prompt: "Convert this image using small, distinct dots of pure color placed in patterns to form a cohesive image when viewed from a distance. Apply scientific color theory with complementary colors placed side by side for optical mixing. Create a serene, contemplative atmosphere with a sense of timeless stillness. Employ precise, methodical technique with careful attention to light effects. Use a limited palette but achieve visual richness through dot placement. Balance geometric order with natural forms."
    },
    {
      id: "caravaggio",
      koreanName: "카라바조",
      englishName: "Michelangelo Merisi da Caravaggio",
      prompt: "Transform this image in Caravaggio's dramatic Baroque style. Use extreme chiaroscuro (tenebrism) with intense contrast between light and shadow. Create theatrical spotlighting effects against a dark background. Depict subjects with unflinching realism and psychological intensity. Include dramatic emotional expressions and gestures. Focus on the central human drama with minimal background elements. Employ a rich, limited palette with deep reds, browns, and blacks punctuated by brilliant highlights. Present figures with powerful physicality and three-dimensionality. Capture the tension, drama, and raw humanity characteristic of Caravaggio's revolutionary approach to painting."
    },
    {
      id: "matisse",
      koreanName: "마티스",
      englishName: "Henri Matisse",
      prompt: "Transform this image by Matisse drawing style. Simple. Black and white"
    },
    {
      id: "modigliani",
      koreanName: "모딜리아니",
      englishName: "Amedeo Modigliani",
      prompt: "Transform this image by elongating figures and faces with simplified, mask-like features. Create almond-shaped, often asymmetrical eyes that appear vacant or unseeing. Use long, graceful neck extensions and tilted heads. Apply a warm, muted palette of ochres, earth tones, and rich blues. Paint with simplified forms and minimal modeling that suggest volume through contour rather than shading. Include influences from African masks and Cycladic sculpture. Create a sense of melancholy isolation and spiritual intensity. Apply paint with visible brushstrokes in thin, transparent layers. Capture elegant simplification and psychological intimacy. Beautiful"
    },
    {
        id: "bernardbuffet",
        koreanName: "베르나르 뷔페",
        englishName: "Bernard Buffet",
        prompt: "Transform this image by Bernard Buffet. Expressionism. Beatuiful."
    },
    {
      id: "davidhockney",
      koreanName: "호크니",
      englishName: "David Hockney",
      prompt: "Create an image using a bright and vibrant color palette. Boldly use vivid colors such as turquoise blue, bright lime green, coral pink, candy red, and chrome yellow. Colors should be applied in flat, uniform areas separated by distinct black or dark outlines. Compose the image in a 'cubist' split format that simultaneously shows scenes from various viewpoints and angles. Create an effect similar to a collage of multiple photographs gathered on one screen. Create contrast by rendering some areas in detail while simplifying others. Exaggerate the interaction of light and shadow, particularly depicting reflected light on surfaces with distinctive patterns. Emphasize refracted light on water, light passing through glass, and geometric patterns created by shadows. Ignore conventional perspective rules and instead create multiple viewpoint effects, producing a unique visual experience as if viewed from several angles simultaneously. Express both the front and side views of subjects at the same time. Use strong color contrasts, prominent geometric shapes, and simplified surface textures with flat expression. Capture special vitality and energy in everyday moments and minor scenes. Create an overall warm and optimistic atmosphere."
    },
    {
      id: "kusamayayoi",
      koreanName: "쿠사마",
      englishName: "Kusama Yayoi",
      prompt: "Transform this image by a universe of dots that unfolds infinitely. Small circular dots meticulously arranged throughout the piece should be used as the main visual element. These dots can be maintained at a consistent size of 2-8mm or gradually change in size from the center outward. Use intense and deep red (#FF0000), bright yellow (#FFFF00), cobalt blue (#0047AB), pure white (#FFFFFF), emerald green (#50C878), and violet purple (#8A2BE2) colors, arranging them to create strong contrasts. You may use all colors in one piece or selectively combine 2-3 colors. Dots can be arranged in patterns such as: Concentric circles radiating from the center Regular arrangements aligned in a grid format Spiral compositions that rotate and gradually become smaller or larger Wave-like curved formations Particularly in some areas, make the dots connect to create structures resembling nets or cellular tissue. These connected sections can be expressed with fine lines or naturally formed as the dots get closer to each other. To maximize the contrast between background and dots, use bright colored dots on dark backgrounds and dark colored dots on bright backgrounds. The density of dots throughout the work can vary, with some areas very densely packed and others more spaciously arranged to create visual rhythm. Overall, the work should evoke an infinitely expanding universe or microscopic world, providing an immersive feeling that makes viewers want to keep looking."
   },
   {
    id: "fridakahlo",
    koreanName: "프리다칼로",
    englishName: "Frida Kahlo",
    prompt: "Transform the uploaded photo into a scene composed of rich Mexican folk elements with vibrating colors. Use bold contrasts of vivid cobalt blue, terracotta red, emerald green, and marigold yellow. Render objects with meticulous detail and slightly exaggerated proportions. Seamlessly blend reality with surrealistic elements. Give anthropomorphic qualities to everyday objects and natural landscapes. Apply brushstrokes in a controlled, precise manner using very thin brushes for elaborate details. The distinction between background and foreground should be clear yet fused in surrealistic ways. The surface should be smooth and glossy, utilizing the deep saturation of oil paints. Shadows and highlights should be dramatic yet natural, maintaining an intimate scale as if painted on a small panel or canvas."
    },
    {
      id: "ghibli",
      koreanName: "지브리",
      englishName: "Ghibli",
      prompt: "Transform this image by Ghibli style."
    },
    {
      id: "japaneseanimation",
      koreanName: "애니메이션",
      englishName: "Japanese Animation",
      prompt: "Transform this image by Japansese Animation. Beatuiful.Vibrant characters with gorgeous artwork, fantastic themes, and large, expressive eyes."
  },
    {
        id: "flatillustration",
        koreanName: "일러스트",
        englishName: "Flat Illustration",
        prompt: "Transform this image by Flat Illustration. Beatuiful.A modern feel with bright, monochrome and geometric designs."
    },
    {
        id: "vintageretro",
        koreanName: "레트로",
        englishName: "Vintage Retro",
        prompt: "Transform this image by Vintage Retro. Beatuiful.Vintage and retro illustration art styles are inspired by a specific era and recreate the look and feel of that era. They often create a unique atmosphere with rich textures and colors that can be warm and cozy or edgy and modern."
    },

  ];
  
  export default artStylePrompts;