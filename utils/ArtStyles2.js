
const artStyles = [
    {
      id: "gogh",
      koreanName: "고흐",
      englishName: "Vincent van Gogh",
      prompt: "Transform this image in the style of Vincent van Gogh. Use thick, visible brushstrokes with bold, swirling patterns. Create a vibrant color palette with strong yellows, blues, and greens. Emphasize emotional expression through exaggerated forms and dynamic movement. Include pronounced outlines and strong contrasts between light and shadow. Add that signature impasto texture with paint that appears to jump off the canvas. Capture the passionate, turbulent energy characteristic of van Gogh's masterpieces like 'Starry Night' and 'Sunflowers'."
    },
    {
      id: "gauguin",
      koreanName: "고갱",
      englishName: "Paul Gauguin",
      prompt: "Render this image in Paul Gauguin's Post-Impressionist style. Use flat planes of bold, non-naturalistic colors with strong outlines. Simplify forms into decorative patterns with minimal shading. Include exotic, dreamlike qualities reminiscent of his Tahitian period. Employ rich, warm earth tones alongside vivid colors. Create a sense of primitive mysticism and symbolic meaning. Flatten the perspective and emphasize two-dimensional composition. Capture Gauguin's distinctive synthetist approach that combines observed reality with memory and imagination."
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
      prompt: "Convert this image into Georges Seurat's Pointillist style. Use small, distinct dots of pure color placed in patterns to form a cohesive image when viewed from a distance. Apply scientific color theory with complementary colors placed side by side for optical mixing. Create a serene, contemplative atmosphere with a sense of timeless stillness. Employ precise, methodical technique with careful attention to light effects. Use a limited palette but achieve visual richness through dot placement. Balance geometric order with natural forms. Maintain a sense of Sunday leisure and modern life characteristic of Seurat's 'A Sunday Afternoon on the Island of La Grande Jatte'."
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
      prompt: "Render this image in the style of Diego Velázquez, master of Spanish Baroque painting. Use subtle, restrained color palettes with masterful tonal variations. Create an atmosphere of aristocratic dignity with psychological depth. Paint with loose, fluid brushwork that becomes more precise in focal areas. Pay special attention to rendering textiles, particularly silks and velvets, with stunning verisimilitude. Add a sense of atmospheric perspective with hazy background elements. Capture natural, unidealized facial features with penetrating psychological insight. Balance formal composition with naturalistic poses. Include the sense of quiet drama and contemplative mood found in Velázquez's court portraits and 'Las Meninas'."
    },
    {
      id: "monet",
      koreanName: "모네",
      englishName: "Claude Monet",
      prompt: "Transform this image in the style of Claude Monet, father of Impressionism. Use loose, visible brushstrokes to capture fleeting effects of light and atmosphere. Create a vibrant palette with subtle color variations to show how light transforms color throughout the day. Emphasize the play of light and reflections, especially on water surfaces. Dissolve solid forms into shimmering fields of color and light. Maintain an atmosphere of spontaneity and freshness as if painted outdoors (en plein air). Focus on atmospheric effects rather than precise details. Include signature Impressionist themes of natural beauty, modern leisure, and the changing qualities of light. Capture the ephemeral, dreamlike quality of Monet's water lilies and garden scenes."
    },
    {
      id: "chagall",
      koreanName: "샤갈",
      englishName: "Marc Chagall",
      prompt: "Convert this image into Marc Chagall's dreamlike, fantastical style. Use vibrant, luminous colors with particular emphasis on blues, purples, and reds. Include floating, flying figures that defy gravity and conventional perspective. Mix reality with fantasy elements like animals playing musical instruments or people flying above villages. Create a childlike whimsy combined with folklore and religious symbolism. Arrange figures in dreamlike, non-linear compositions. Add Jewish cultural elements and symbols from Eastern European folk art. Layer transparent colors for a stained-glass effect. Maintain the poetic, nostalgic quality characteristic of Chagall's work, blending joy with melancholy and memory with imagination."
    },
    {
      id: "munch",
      koreanName: "뭉크",
      englishName: "Edvard Munch",
      prompt: "Transform this image in the style of Edvard Munch's Expressionism. Use flowing, undulating lines that create a sense of psychological tension and movement. Create bold, non-naturalistic colors to convey emotional states rather than realistic representation. Simplify forms to their emotional essence with elongated, distorted figures. Emphasize feelings of anxiety, alienation, and existential dread. Apply paint with visible brushstrokes in swirling patterns. Use strong, unnatural contrasts and juxtapositions of complementary colors. Include a symbolic representation of inner turmoil with a brooding, haunting atmosphere. Capture the deep psychological intensity and raw emotional power characteristic of Munch's 'The Scream'."
    },
    {
      id: "picasso",
      koreanName: "피카소",
      englishName: "Pablo Picasso",
      prompt: "Render this image in the style of Pablo Picasso's Cubism. Deconstruct the subject into geometric shapes and planes that show multiple perspectives simultaneously. Fragment and reassemble forms to create a complex, multi-viewpoint representation. Use a restricted palette of earth tones, grays, blacks, and blues. Create flat, interlocking planes that suggest three-dimensionality without traditional perspective. Include characteristic Cubist elements like musical instruments, bottles, or newspaper fragments if appropriate. Balance analytical deconstruction with synthetic reconstruction. Show the influence of African masks with angular facial features. Capture the revolutionary intellectual approach of Cubism that analyzes form rather than imitating appearance."
    },
    {
      id: "renoir",
      koreanName: "르누아르",
      englishName: "Pierre-Auguste Renoir",
      prompt: "Transform this image in the style of Pierre-Auguste Renoir. Use soft, feathery brushstrokes that create a sense of warmth and intimacy. Create a luminous palette with pearly pinks, soft blues, and warm golds that capture the glow of sunlight on skin. Depict figures with rounded, sensuous forms and rosy complexions. Emphasize joy, pleasure, and the beauty of everyday life. Capture dappled light filtering through foliage or reflecting off water. Add a sense of spontaneous movement and casual elegance. Paint with visible but blended brushwork that creates a vibrating surface texture. Include the atmosphere of leisure and social pleasure characteristic of Renoir's scenes of Parisian life and countryside outings."
    },
    {
      id: "matisse",
      koreanName: "마티스",
      englishName: "Henri Matisse",
      prompt: "Convert this image into Henri Matisse's style, particularly his Fauve and later cut-out periods. Use bold, non-naturalistic colors with expressive freedom. Simplify forms to their essential elements with flattened perspective. Create harmonious compositions with decorative patterns and arabesques. Embrace color as the primary means of expression, using it for emotional and compositional impact rather than representation. Include areas of pure, unmixed color with minimal shading. Add decorative motifs and patterns from Islamic art, textiles, and North African influences. Maintain a sense of joyful spontaneity and balance. Capture the Mediterranean light and sensual pleasure characteristic of Matisse's odalisques and Nice period works."
    },
    {
      id: "magritte",
      koreanName: "마그리트",
      englishName: "René Magritte",
      prompt: "Transform this image in the style of René Magritte's Surrealism. Use precise, realistic technique to depict impossible or contradictory scenes. Create dreamlike juxtapositions of ordinary objects in extraordinary contexts. Employ clean lines and detailed rendering with a smooth, almost illustrative quality. Use a limited palette with cool blues, warm browns, and crisp whites. Include characteristic Magritte motifs like cloudy skies, bowler hats, or curtains if appropriate. Present familiar objects in unfamiliar relationships that challenge perception. Maintain a sense of mystery and philosophical questioning. Capture the uncanny logic of dreams with meticulous attention to detail. Add the signature conceptual wit and visual paradoxes characteristic of Magritte's 'The Treachery of Images' and 'The Empire of Light'."
    },
    {
      id: "delacroix",
      koreanName: "들라크루아",
      englishName: "Eugène Delacroix",
      prompt: "Render this image in the Romantic style of Eugène Delacroix. Use dynamic, swirling compositions with dramatic diagonal movement. Create rich, vibrant colors with particular emphasis on complementary contrasts. Depict intense emotional drama and passionate expression. Apply paint with energetic, visible brushstrokes that suggest movement and excitement. Include exotic elements from North African or Middle Eastern influences if appropriate. Create a sense of theatrical drama with strong light and shadow effects. Focus on emotional and psychological intensity rather than classical restraint. Capture the heightened sense of color, motion, and emotion characteristic of Delacroix's 'Liberty Leading the People' and 'The Death of Sardanapalus'."
    },
    {
      id: "david",
      koreanName: "자크 루이 다비드",
      englishName: "Jacques-Louis David",
      prompt: "Transform this image in the Neoclassical style of Jacques-Louis David. Use precise, controlled brushwork with smooth, polished surfaces. Create clear, balanced compositions with theatrical staging influenced by classical sculpture. Apply a cool, restrained color palette with emphasis on drawing and form over color. Include dramatic lighting that emphasizes three-dimensional form and moral gravity. Depict figures with idealized proportions and noble expressions showing emotional restraint. Arrange subjects in frieze-like compositions with references to ancient Greek and Roman art. Focus on moral and civic virtues with heroic themes. Capture the intellectual clarity, political purpose, and austere grandeur characteristic of David's 'The Death of Socrates' and 'The Oath of the Horatii'."
    },
    {
      id: "dali",
      koreanName: "달리",
      englishName: "Salvador Dalí",
      prompt: "Convert this image into Salvador Dalí's Surrealist style. Use hyper-realistic technique to render impossible dreamscapes and melting forms. Create stark, barren landscapes with dramatic perspectival depth and strange horizon lines. Include trademark Dalí symbols like melting clocks, crutches, or ants if appropriate. Apply meticulous detail with careful attention to shadow and highlight. Use symbolic juxtapositions that suggest psychological meaning and unconscious desires. Create a sense of paranoid-critical transformation where objects become other objects. Employ saturated colors against bleached, desert-like backgrounds. Maintain a hallucinatory clarity with precise rendering of bizarre visions. Capture the unsettling combination of the familiar and the impossible characteristic of Dalí's 'The Persistence of Memory'."
    },
    {
      id: "modigliani",
      koreanName: "모딜리아니",
      englishName: "Amedeo Modigliani",
      prompt: "Transform this image in the distinctive style of Amedeo Modigliani. Elongate figures and faces with simplified, mask-like features. Create almond-shaped, often asymmetrical eyes that appear vacant or unseeing. Use long, graceful neck extensions and tilted heads. Apply a warm, muted palette of ochres, earth tones, and rich blues. Paint with simplified forms and minimal modeling that suggest volume through contour rather than shading. Include the influence of African masks and Cycladic sculpture. Create a sense of melancholy isolation and spiritual intensity. Apply paint with visible brushstrokes in thin, transparent layers. Capture the elegant simplification and psychological intimacy characteristic of Modigliani's portraits and nudes."
    },
    {
      id: "kahlo",
      koreanName: "프리다 칼로",
      englishName: "Frida Kahlo",
      prompt: "Render this image in the style of Frida Kahlo's magical realism. Use bright, vibrant Mexican folk art colors with particular emphasis on reds, yellows, and greens. Create detailed, symbolic self-representation with unflinching emotional honesty. Include elements of Mexican culture, nature, and pre-Columbian mythology. Depict physical and emotional pain transformed into visual metaphors. Apply flat, two-dimensional composition with minimal perspective. Add supernatural or surrealist elements that externalize internal states. Paint with meticulous detail using small brushes and precise lines. Include symbolic animals, plants, or anatomical imagery. Capture the raw emotional power, physical suffering, and personal mythology characteristic of Kahlo's self-portraits."
    },
    {
      id: "kusama",
      koreanName: "쿠사마 야요이",
      englishName: "Yayoi Kusama",
      prompt: "Transform this image using a distinctive artistic style featuring an obsessive pattern of uniform polka dots in high contrast colors. Create a hypnotic visual effect with repetitive dots that may be black on vibrant backgrounds (yellow, red, etc.) or colorful dots on dark/black surfaces. Apply the dots in a precise, all-over pattern that creates visual vibration and optical tension. Maintain an immersive quality where the repetitive elements suggest infinity while transforming the original subject. The dot pattern should be methodical yet psychologically intense, creating a sense of both order and cosmic scale. Incorporate the characteristic balance between playfulness and psychological depth with the dots potentially obliterating or redefining the underlying forms. The overall effect should feature the distinctive contrast between structured repetition and visual dynamism that characterizes this iconic dot-based artistic approach."
    },
    {
      id: "hockney",
      koreanName: "호크니",
      englishName: "David Hockney",
      prompt: "Convert this image into David Hockney's distinctive style. Use bright, saturated California colors with particular emphasis on swimming pool blues, hot pinks, and vibrant greens. Create flat areas of color with minimal modeling or shading. Depict space with altered perspective that combines multiple viewpoints. Include characteristic Hockney themes of swimming pools, domestic interiors, or portraits of friends if appropriate. Apply visible, confident brushwork or the appearance of iPad drawing if using his digital style. Create a sense of sunlit pleasure and quietude with attention to the play of light. Combine photographic realism with areas of pattern and abstraction. Capture the fresh observation of ordinary scenes and the joyful exploration of visual perception characteristic of Hockney's work throughout his career."
    }
  ];
  
  export default artStyles;