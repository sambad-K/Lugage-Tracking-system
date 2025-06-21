const { connectToDatabase } = require("./database");
const natural = require("natural");
const { WordTokenizer, PorterStemmer } = natural;
const { TfIdf } = natural;
const tokenizer = new WordTokenizer();
const { removeStopwords } = require("stopword");
const levenshtein = require("fast-levenshtein");

const tfidf = new TfIdf();

const getSynonyms = (word) => {
  const synonyms = {
    bag: [
      "sack",
      "backpack",
      "luggage",
      "pouch",
      "purse",
      "tote",
      "handbag",
      "satchel",
      "pack",
      "knapsack",
    ],
    stripe: ["line", "band", "streak", "bar", "striation"],
    TSA_lock: ["TSA approved lock", "security lock"],
    garment: ["clothing", "attire"],
    stripe: ["line", "band", "streak", "bar", "striation"],
    zip: ["zipper", "fastener", "closure", "snap", "button", "clasp"],
    pink: ["rose", "fuchsia", "magenta", "blush", "coral", "peach"],
    blue: [
      "azure",
      "navy",
      "sky",
      "teal",
      "cyan",
      "cerulean",
      "sapphire",
      "indigo",
    ],
    color: ["colour", "shade", "hue", "tint", "tone", "pigment"],
    red: ["crimson", "scarlet", "ruby", "garnet", "vermilion", "maroon"],
    white: ["pale", "ivory", "snow", "pearl", "alabaster", "milky"],
    black: ["charcoal", "ebony", "jet", "inky", "sable", "midnight"],
    green: ["emerald", "jade", "lime", "olive", "chartreuse", "mint"],
    yellow: ["amber", "gold", "lemon", "canary", "saffron", "butter"],
    purple: ["violet", "lavender", "mauve", "plum", "amethyst", "lilac"],
    grey: ["gray", "ash", "slate", "charcoal", "pewter", "dove"],
    brown: ["chestnut", "umber", "tan", "copper", "bronze", "sepia"],
    orange: ["tangerine", "coral", "amber", "peach", "citrus", "pumpkin"],
    turquoise: ["aqua", "cyan", "teal", "sea green", "aquamarine"],
    lavender: ["lilac", "mauve", "periwinkle", "orchid"],
    beige: ["tan", "khaki", "taupe", "buff"],
    maroon: ["burgundy", "wine", "claret", "carmine"],
    silver: ["gray", "platinum", "steel", "metallic"],
    gold: ["yellow", "gilded", "golden", "sunshine"],
    teal: ["blue-green", "cyan", "aquamarine"],
    khaki: ["tan", "beige", "brown"],
    indigo: ["navy", "midnight", "blue-violet"],
    magenta: ["fuchsia", "hot pink", "purple-red"],
    amber: ["yellow", "honey", "saffron"],
    mint: ["pale green", "seafoam"],
    apricot: ["peach", "pale orange"],
    coral: ["salmon", "pink-orange"],
    navy: ["dark blue", "marine"],
    olive: ["green-brown", "sage", "military green"],
    fuchsia: ["magenta", "hot pink"],
    plum: ["purple", "violet", "mauve"],
    rose: ["pink", "blush"],
    ruby: ["red", "crimson"],
    small: ["little", "tiny", "miniature", "petite"],
    large: ["big", "huge", "massive", "giant"],
    suitcase: ["baggage", "case", "valise", "trunk", "briefcase"],
    missing: ["lost", "gone", "misplaced", "vanished"],
    found: ["located", "discovered", "retrieved"],
    airport: ["airstrip", "aerodrome", "terminal", "airfield"],
    shiny: ["glossy", "lustrous", "sparkly", "gleaming"],
    old: ["antique", "ancient", "vintage"],
    new: ["modern", "recent", "contemporary"],
    hard: ["solid", "firm", "rigid", "sturdy"],
    soft: ["plush", "cushiony", "gentle"],
    heavy: ["weighty", "hefty", "bulky", "substantial"],
    light: ["airy", "flimsy", "featherweight", "delicate"],
    hidden: ["concealed", "covered", "buried", "obscured"],
    worn: ["used", "weathered", "frayed"],
    favorite: ["preferred", "beloved", "cherished"],
    waterproof: ["water-resistant", "water-repellent"],
    durable: ["sturdy", "tough", "long-lasting"],
    spacious: ["roomy", "large", "ample"],
    compact: ["small", "tight", "condensed"],
    travel: ["journey", "trip", "voyage"],
    security: ["safety", "protection"],
    owner: ["possessor", "holder", "proprietor"],
    fragile: ["delicate", "breakable", "brittle"],
    valuable: ["precious", "expensive", "costly"],
    wheels: ["rollers", "casters", "spinners"],
    handle: ["grip", "strap", "handgrip"],
    expandable: ["extendable", "stretchable"],
    lock: ["secure", "fasten", "clasp"],
    pockets: ["compartments", "sections", "slots"],
    hardshell: ["hard-sided", "rigid", "solid"],
    lightweight: ["featherweight", "easy to carry"],
    spinner: ["rotating", "360-degree wheels"],
    built_in_scale: ["integrated scale", "weight measure"],
    TSA_lock: ["TSA approved lock", "security lock"],
    garment: ["clothing", "attire"],
    RFID: ["radio-frequency identification", "wireless identification"],
    compression_straps: ["tightening straps", "fastening straps"],
    water_resistant: ["waterproof", "water-repellent"],
    RFID_blocking: ["RFID protection", "anti-RFID"],
    anti_theft: ["theft-proof", "secure"],
    USB_port: ["charging port", "power bank"],
    laptop_compartment: ["laptop sleeve", "computer pocket"],
    padded: ["cushioned", "softened", "protected"],
    adjustable: ["adaptable", "changeable", "modifiable"],
    ergonomic: ["comfortable", "user-friendly"],
    breathable: ["ventilated", "airy"],
    padded_straps: ["cushioned straps", "softened straps"],
    water_bottle_holder: ["bottle pocket", "hydration pocket"],
    shoe_compartment: ["footwear pocket", "sneaker pocket"],
    laundry_bag: ["clothes bag", "garment bag"],
    toiletry_bag: ["cosmetics bag", "hygiene bag"],
    wet_pocket: ["moisture pocket", "damp pocket"],
    rain_cover: ["weather cover", "rain protector"],
    luggage_tag: ["bag tag", "identification tag"],
    luggage_strap: ["bag strap", "belt strap"],
    luggage_scale: ["weight scale", "bag scale"],
    luggage_covers: ["bag covers", "protectors"],
    luggage_accessories: ["bag accessories", "bag add-ons"],
    luggage_storage: ["bag storage", "bag organizer"],
    luggage_rack: ["bag rack", "bag stand"],
    luggage_handle: ["bag handle", "bag grip"],
    luggage_wheels: ["bag wheels", "bag rollers"],
    luggage_lock: ["bag lock", "bag fasten"],
    luggage_zipper: ["bag zipper", "bag closure"],
    luggage_pockets: ["bag compartments", "bag sections"],
    luggage_straps: ["bag straps", "bag fasteners"],
    luggage_compartments: ["bag slots", "bag pockets"],
    luggage_material: ["bag fabric", "bag textile"],
    luggage_color: ["bag shade", "bag hue"],
    luggage_size: ["bag dimensions", "bag measurements"],
    luggage_shape: ["bag form", "bag structure"],
    luggage_weight: ["bag mass", "bag heaviness"],
  };
  return synonyms[word] || [word];
};

const matchesSynonym = (word, list) => {
  return list.some((item) => getSynonyms(item).includes(word) || word === item);
};

const extractMeaningfulTokens = (tokens) => {
  const commonPhrases = [
    "bag",
    "luggage",
    "find",
    "left",
    "lost",
    "my",
    "a",
    "the",
    "with",
    "and",
    "of",
    "in",
    "on",
    "at",
    "attached",
    "it",
  ];
  return tokens.filter((token) => !commonPhrases.includes(token));
};

const cosineSimilarity = (vec1, vec2) => {
  const dotProduct = vec1.reduce(
    (sum, value, index) => sum + value * vec2[index],
    0
  );
  const magnitudeVec1 = Math.sqrt(
    vec1.reduce((sum, value) => sum + value * value, 0)
  );
  const magnitudeVec2 = Math.sqrt(
    vec2.reduce((sum, value) => sum + value * value, 0)
  );

  if (magnitudeVec1 === 0 || magnitudeVec2 === 0) {
    return 0;
  }

  return dotProduct / (magnitudeVec1 * magnitudeVec2);
};

const calculateSimilarity = (messageTokens, postTokens) => {
  const commonTokens = messageTokens.filter((token) =>
    matchesSynonym(token, postTokens)
  );
  const overlapScore =
    commonTokens.length / Math.max(messageTokens.length, postTokens.length);

  const exactMatchScore = messageTokens.every((token) =>
    matchesSynonym(token, postTokens)
  )
    ? 1
    : 0;

  const levenshteinDistance = levenshtein.get(
    messageTokens.join(" "),
    postTokens.join(" ")
  );
  const levenshteinScore =
    1 -
    levenshteinDistance /
      Math.max(messageTokens.join(" ").length, postTokens.join(" ").length);

  const contextWeight = commonTokens.length / messageTokens.length;

  const keyDescriptors = [
    "blue",
    "pink",
    "zip",
    "stripe",
    "red",
    "cover",
    "logo",
    "white",
    "black",
    "bottle",
    "lock",
    "passport",
    "wallet",
  ];
  const keyDescriptorWeight =
    commonTokens.filter((token) => keyDescriptors.includes(token)).length /
    keyDescriptors.length;

  const adjustedOverlapScore = overlapScore * 0.4;
  const adjustedKeyDescriptorWeight = keyDescriptorWeight * 0.4;

  return (
    adjustedOverlapScore +
    exactMatchScore * 0.1 +
    levenshteinScore * 0.1 +
    contextWeight * 0.4 +
    adjustedKeyDescriptorWeight
  );
};

const handlePostQuery = async (message, sessionId) => {
  console.log("Received message:", message);

  const triggerPhrases = [
    "i have lost my luggage",
    "i have lost a luggage",
    "lost my luggage at the airport",
    "can't locate my bag",
    "i have lost a luggage",
    "lost my material",
    "missing",
    "cant find",
    "cannot find",
    "lost a",
    "i lost a luggage",
    "i lost my bag",
    "missing luggage",
    "missing bag",
    "lost my",
    "i lost",
    "missing my",
    "lost baggage",
    "lost suitcase",
    "missing suitcase",
    "i can't find my luggage",
    "can't find my bag",
    "i can't find my suitcase",
    "misplaced my luggage",
    "left my bag",
    "left my luggage",
    "left my suitcase",
    "i have lost",
    "lost my luggage at the airport",
    "can't locate my bag",
    "i cannot find",
    "cannot find my",
    "cannot find",
    "check post of",
    "is there a post related to",
    "is there a post of",
    "is there a post",
    "lost"
  ];

  const triggerPhrasePattern = new RegExp(triggerPhrases.join("|"), "i");

  let details = message;
  const containsTriggerPhrase = triggerPhrasePattern.test(message);
  if (containsTriggerPhrase) {
    details = message.replace(triggerPhrasePattern, "").trim();
  }

  if (!containsTriggerPhrase || details.length === 0 || message === details) {
    return null;
  }

  const db = await connectToDatabase();
  const postersCollection = db.collection("posters");

  let messageTokens = tokenizer.tokenize(
    details.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_~()]/g, "")
  );
  messageTokens = removeStopwords(messageTokens);
  messageTokens = messageTokens.map((word) => PorterStemmer.stem(word));
  messageTokens = extractMeaningfulTokens(messageTokens);

  if (messageTokens.length === 0) {
    return "No meaningful details found to compare. Please provide more details.";
  }

  console.log("Tokenized words:", messageTokens);

  //TF-IDF vectorization
  let matchedPosts = await postersCollection.find({}).toArray();
  matchedPosts.forEach((post) => {
    if (post.moreDetails) {
      let postTokens = tokenizer.tokenize(
        post.moreDetails
          .toLowerCase()
          .replace(/[.,\/#!$%\^&\*;:{}=\-_~()]/g, "")
      );
      postTokens = removeStopwords(postTokens);
      postTokens = postTokens.map((word) => PorterStemmer.stem(word));
      tfidf.addDocument(extractMeaningfulTokens(postTokens));
    }
  });

  //TF-IDF vectors for the message and calculate similarity
  const messageTfidfVector = [];
  tfidf.tfidfs(
    messageTokens.join(" "),
    (i, measure) => (messageTfidfVector[i] = measure)
  );

  matchedPosts = matchedPosts
    .map((post, index) => {
      if (!post.moreDetails) {
        return { ...post, score: 0 };
      }
      let postTokens = tokenizer.tokenize(
        post.moreDetails
          .toLowerCase()
          .replace(/[.,\/#!$%\^&\*;:{}=\-_~()]/g, "")
      );
      postTokens = removeStopwords(postTokens);
      postTokens = postTokens.map((word) => PorterStemmer.stem(word));
      postTokens = extractMeaningfulTokens(postTokens);

      const similarityScore = calculateSimilarity(messageTokens, postTokens);

      //Similarity score with TF-IDF vector and cosine similarity
      const postTfidfVector = [];
      tfidf.tfidfs(
        postTokens.join(" "),
        (j, measure) => (postTfidfVector[j] = measure)
      );
      const tfidfScore = cosineSimilarity(messageTfidfVector, postTfidfVector);

      console.log(
        "Post:",
        post.moreDetails,
        "Score:",
        similarityScore,
        "TF-IDF Score:",
        tfidfScore
      );

      return { ...post, score: (similarityScore + tfidfScore) / 2, postTokens };
    })
    .filter((post) => post.score > 0.1);
  console.log("Matched Posts:", matchedPosts);

  if (matchedPosts.length > 0) {
    matchedPosts.sort((a, b) => b.score - a.score);

    const highestScore = matchedPosts[0].score;
    const differenceThreshold = 0.2;

    const similarMatches = matchedPosts.filter(
      (post) => highestScore - post.score <= differenceThreshold
    );

    if (similarMatches.length > 1) {
      const names = similarMatches.map((post) => post.fullName).join(", ");
      return `There are multiple posts related to your detail. Check the posts by ${names}.`;
    } else {
      return `Yes, there is a post related to your detail. Check the post by ${matchedPosts[0].fullName}. Check Post `;
    }
  } else {
    return "No post matching your detail. Report please.";
  }
};

module.exports = handlePostQuery;
