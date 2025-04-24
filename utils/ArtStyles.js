const artStylePrompts = [
    {
      id: "gogh",
      koreanName: "고흐",
      englishName: "Vincent van Gogh",
      prompt: "Transform this image in the style of Vincent van Gogh. Use thick, visible brushstrokes with bold, swirling patterns. Create a vibrant color palette with strong yellows, blues, and greens. Emphasize emotional expression through exaggerated forms and dynamic movement. Include pronounced outlines and strong contrasts between light and shadow. Add that signature impasto texture with paint that appears to jump off the canvas. Capture the passionate, turbulent energy characteristic of van Gogh's masterpieces like 'Starry Night' and 'Sunflowers'."
    },
    {
        id: "giotto",
        koreanName: "조토",
        englishName: "Giotto di Bondone",
        prompt: "Transform this image in the style of Giotto di Bondone, the father of Renaissance painting. Use solemn, dignified figures with weightiness and volume, breaking from Byzantine flatness. Employ a rich but limited medieval color palette dominated by ultramarine blue, vermilion, and gold. Create clear spatial relationships and simplified architectural elements. Give figures emotionally expressive faces and naturalistic poses that convey human drama. Include halos and religious iconography as appropriate. Maintain the formal composition and devotional gravity of 14th-century Italian religious art. Add subtle shadows to suggest three-dimensionality while keeping a somewhat flattened perspective."
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
      id: "munch",
      koreanName: "뭉크",
      englishName: "Edvard Munch",
      prompt: "Transform this image using flowing, undulating lines that create a sense of psychological tension and movement. Create bold, non-naturalistic colors to convey emotional states rather than realistic representation. Simplify forms to their emotional essence with elongated, distorted figures. Emphasize feelings of anxiety, alienation, and existential dread. Apply paint with visible brushstrokes in swirling patterns. Use strong, unnatural contrasts and juxtapositions of complementary colors. Include a symbolic representation of inner turmoil with a brooding, haunting atmosphere. Capture deep psychological intensity and raw emotional power."
    },
    {
      id: "picasso",
      koreanName: "피카소",
      englishName: "Pablo Picasso",
      prompt: "Transform this image by Pablo Picasso style. Cubism. Beatuiful."
    //   prompt: "Render this image by deconstructing the subject into geometric shapes and planes that show multiple perspectives simultaneously. Fragment and reassemble forms to create a complex, multi-viewpoint representation. Create flat, interlocking planes that suggest three-dimensionality without traditional perspective. Include characteristic elements like musical instruments, bottles, or newspaper fragments if appropriate. Balance analytical deconstruction with synthetic reconstruction. Show angular facial features influenced by African masks. Analyze form rather than imitating appearance."
    },
    {
      id: "renoir",
      koreanName: "르누아르",
      englishName: "Pierre-Auguste Renoir",
      prompt: "Transform this image using soft, feathery brushstrokes that create a sense of warmth and intimacy. Create a luminous palette with pearly pinks, soft blues, and warm golds that capture the glow of sunlight on skin. Depict figures with rounded, sensuous forms and rosy complexions. Emphasize joy, pleasure, and the beauty of everyday life. Capture dappled light filtering through foliage or reflecting off water. Add a sense of spontaneous movement and casual elegance. Paint with visible but blended brushwork that creates a vibrating surface texture. Include an atmosphere of leisure and social pleasure."
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
        id: "AlphonseMucha",
        koreanName: "알폰스 무하",
        englishName: "Alphonse Mucha",
        prompt: "Transform this image by Alphonse Mucha style. Art Nouveau. Beatuiful."
    },
    {
        id: "bernardbuffet",
        koreanName: "베르나르 뷔페",
        englishName: "Bernard Buffet",
        prompt: "Transform this image by Bernard Buffet. Expressionism. Beatuiful."
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
    {
        id: "japaneseanimation",
        koreanName: "애니메이션",
        englishName: "Japanese Animation",
        prompt: "Transform this image by Japansese Animation. Beatuiful.Vibrant characters with gorgeous artwork, fantastic themes, and large, expressive eyes."
    },
  ];
  
  export default artStylePrompts;