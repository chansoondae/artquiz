const artStylePrompts = [
    {
      id: "gogh",
      koreanName: "고흐",
      englishName: "Vincent van Gogh",
      prompt: "Transform this image with thick, visible brushstrokes with bold, swirling patterns. Use a vibrant color palette with strong yellows, blues, and greens. Emphasize emotional expression through exaggerated forms and dynamic movement. Include pronounced outlines and strong contrasts between light and shadow. Add impasto texture with paint that appears to jump off the canvas. Capture a passionate, turbulent energy in the composition."
    },
    {
      id: "gauguin",
      koreanName: "고갱",
      englishName: "Paul Gauguin",
      prompt: "Render this image using flat planes of bold, non-naturalistic colors with strong outlines. Simplify forms into decorative patterns with minimal shading. Include exotic, dreamlike qualities. Employ rich, warm earth tones alongside vivid colors. Create a sense of primitive mysticism and symbolic meaning. Flatten the perspective and emphasize two-dimensional composition. Combine observed reality with memory and imagination."
    },
    {
      id: "giotto",
      koreanName: "조토",
      englishName: "Giotto di Bondone",
      prompt: "Transform this image with solemn, dignified figures with weightiness and volume. Use a rich but limited medieval color palette dominated by ultramarine blue, vermilion, and gold. Create clear spatial relationships and simplified architectural elements. Give figures emotionally expressive faces and naturalistic poses that convey human drama. Include halos and religious iconography as appropriate. Maintain a formal composition and devotional gravity. Add subtle shadows to suggest three-dimensionality while keeping a somewhat flattened perspective."
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
      id: "velazquez",
      koreanName: "벨라스케스",
      englishName: "Diego Velázquez",
      prompt: "Render this image using subtle, restrained color palettes with masterful tonal variations. Create an atmosphere of aristocratic dignity with psychological depth. Paint with loose, fluid brushwork that becomes more precise in focal areas. Pay special attention to rendering textiles, particularly silks and velvets, with stunning verisimilitude. Add a sense of atmospheric perspective with hazy background elements. Capture natural, unidealized facial features with penetrating psychological insight. Balance formal composition with naturalistic poses. Include a sense of quiet drama and contemplative mood."
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
      prompt: "Convert this image using vibrant, luminous colors with particular emphasis on blues, purples, and reds. Include floating, flying figures that defy gravity and conventional perspective. Mix reality with fantasy elements like animals playing musical instruments or people flying above villages. Create a childlike whimsy combined with folklore and religious symbolism. Arrange figures in dreamlike, non-linear compositions. Add cultural elements and symbols from Eastern European folk art. Layer transparent colors for a stained-glass effect. Blend joy with melancholy and memory with imagination."
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
      prompt: "Render this image by deconstructing the subject into geometric shapes and planes that show multiple perspectives simultaneously. Fragment and reassemble forms to create a complex, multi-viewpoint representation. Use a restricted palette of earth tones, grays, blacks, and blues. Create flat, interlocking planes that suggest three-dimensionality without traditional perspective. Include characteristic elements like musical instruments, bottles, or newspaper fragments if appropriate. Balance analytical deconstruction with synthetic reconstruction. Show angular facial features influenced by African masks. Analyze form rather than imitating appearance."
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
      prompt: "Convert this image using bold, non-naturalistic colors with expressive freedom. Simplify forms to their essential elements with flattened perspective. Create harmonious compositions with decorative patterns and arabesques. Embrace color as the primary means of expression, using it for emotional and compositional impact rather than representation. Include areas of pure, unmixed color with minimal shading. Add decorative motifs and patterns from Islamic art, textiles, and North African influences. Maintain a sense of joyful spontaneity and balance. Capture Mediterranean light and sensual pleasure."
    },
    {
      id: "magritte",
      koreanName: "마그리트",
      englishName: "René Magritte",
      prompt: "Transform this image using precise, realistic technique to depict impossible or contradictory scenes. Create dreamlike juxtapositions of ordinary objects in extraordinary contexts. Employ clean lines and detailed rendering with a smooth, almost illustrative quality. Use a limited palette with cool blues, warm browns, and crisp whites. Include characteristic motifs like cloudy skies, bowler hats, or curtains if appropriate. Present familiar objects in unfamiliar relationships that challenge perception. Maintain a sense of mystery and philosophical questioning. Capture the uncanny logic of dreams with meticulous attention to detail. Add conceptual wit and visual paradoxes."
    },
    {
      id: "delacroix",
      koreanName: "들라크루아",
      englishName: "Eugène Delacroix",
      prompt: "Render this image using dynamic, swirling compositions with dramatic diagonal movement. Create rich, vibrant colors with particular emphasis on complementary contrasts. Depict intense emotional drama and passionate expression. Apply paint with energetic, visible brushstrokes that suggest movement and excitement. Include exotic elements from North African or Middle Eastern influences if appropriate. Create a sense of theatrical drama with strong light and shadow effects. Focus on emotional and psychological intensity rather than classical restraint. Capture a heightened sense of color, motion, and emotion."
    },
    {
      id: "david",
      koreanName: "자크 루이 다비드",
      englishName: "Jacques-Louis David",
      prompt: "Transform this image using precise, controlled brushwork with smooth, polished surfaces. Create clear, balanced compositions with theatrical staging influenced by classical sculpture. Apply a cool, restrained color palette with emphasis on drawing and form over color. Include dramatic lighting that emphasizes three-dimensional form and moral gravity. Depict figures with idealized proportions and noble expressions showing emotional restraint. Arrange subjects in frieze-like compositions with references to ancient Greek and Roman art. Focus on moral and civic virtues with heroic themes. Capture intellectual clarity, political purpose, and austere grandeur."
    },
    {
      id: "dali",
      koreanName: "달리",
      englishName: "Salvador Dalí",
      prompt: "Convert this image using hyper-realistic technique to render impossible dreamscapes and melting forms. Create stark, barren landscapes with dramatic perspectival depth and strange horizon lines. Include trademark symbols like melting clocks, crutches, or ants if appropriate. Apply meticulous detail with careful attention to shadow and highlight. Use symbolic juxtapositions that suggest psychological meaning and unconscious desires. Create a sense of paranoid-critical transformation where objects become other objects. Employ saturated colors against bleached, desert-like backgrounds. Maintain a hallucinatory clarity with precise rendering of bizarre visions. Capture the unsettling combination of the familiar and the impossible."
    },
    {
      id: "modigliani",
      koreanName: "모딜리아니",
      englishName: "Amedeo Modigliani",
      prompt: "Transform this image by elongating figures and faces with simplified, mask-like features. Create almond-shaped, often asymmetrical eyes that appear vacant or unseeing. Use long, graceful neck extensions and tilted heads. Apply a warm, muted palette of ochres, earth tones, and rich blues. Paint with simplified forms and minimal modeling that suggest volume through contour rather than shading. Include influences from African masks and Cycladic sculpture. Create a sense of melancholy isolation and spiritual intensity. Apply paint with visible brushstrokes in thin, transparent layers. Capture elegant simplification and psychological intimacy."
    },
    {
      id: "kahlo",
      koreanName: "프리다 칼로",
      englishName: "Frida Kahlo",
      prompt: "Render this image using bright, vibrant folk art colors with particular emphasis on reds, yellows, and greens. Create detailed, symbolic self-representation with unflinching emotional honesty. Include elements of Mexican culture, nature, and pre-Columbian mythology. Depict physical and emotional pain transformed into visual metaphors. Apply flat, two-dimensional composition with minimal perspective. Add supernatural or surrealist elements that externalize internal states. Paint with meticulous detail using small brushes and precise lines. Include symbolic animals, plants, or anatomical imagery. Capture raw emotional power, physical suffering, and personal mythology."
    },
    {
      id: "kusama",
      koreanName: "쿠사마 야요이",
      englishName: "Yayoi Kusama",
      prompt: "Transform this image using an obsessive pattern of uniform polka dots in high contrast colors. Create a hypnotic visual effect with repetitive dots that may be black on vibrant backgrounds (yellow, red, etc.) or colorful dots on dark/black surfaces. Apply the dots in a precise, all-over pattern that creates visual vibration and optical tension. Maintain an immersive quality where the repetitive elements suggest infinity while transforming the original subject. Make the dot pattern methodical yet psychologically intense, creating a sense of both order and cosmic scale. Incorporate a balance between playfulness and psychological depth with the dots potentially obliterating or redefining the underlying forms. Create a distinctive contrast between structured repetition and visual dynamism."
    },
    {
      id: "hockney",
      koreanName: "호크니",
      englishName: "David Hockney",
      prompt: "Convert this image using bright, saturated colors with particular emphasis on swimming pool blues, hot pinks, and vibrant greens. Create flat areas of color with minimal modeling or shading. Depict space with altered perspective that combines multiple viewpoints. Include characteristic themes of swimming pools, domestic interiors, or portraits of friends if appropriate. Apply visible, confident brushwork or the appearance of digital drawing. Create a sense of sunlit pleasure and quietude with attention to the play of light. Combine photographic realism with areas of pattern and abstraction. Capture fresh observation of ordinary scenes and joyful exploration of visual perception."
    }
  ];
  
  export default artStylePrompts;