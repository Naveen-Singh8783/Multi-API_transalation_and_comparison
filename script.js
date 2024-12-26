const googleTranslateURL = "https://translate.googleapis.com/translate_a/single";
const myMemoryTranslateURL = "https://api.mymemory.translated.net/get";
const openaiURL = "https://models.inference.ai.azure.com/chat/completions";
const openaiModel = "gpt-4o-mini";
let openaiApiKey = "";

// Set OpenAI API key
function setOpenAiKey() {
  openaiApiKey = jQuery("#openAiKeyInput").val().trim();
  $("#enterOpenAIKey").html("<b>OpenAI API key has been set.</b>");
}

// Translation and comparison logic
function translateAndCompare() {
  const inputText = $("#userInput").val().trim();
  const sourceLang = $("#sourceLang").val();
  const targetLang = $("#targetLang").val();

  if (!inputText) {
    $("#apiResponse").html("<font color=red><b>Please enter some text to translate.</b></font>");
    return;
  }

  $("#apiResponse").html("<b>Processing translations...</b>");

  Promise.all([
    callGoogleTranslateAPI(inputText, sourceLang, targetLang),
    callMyMemoryAPI(inputText, sourceLang, targetLang),
  ])
    .then(([googleTranslation, myMemoryTranslation]) => {
      $("#apiResponse").html(`
        <b>Google Translate:</b> "${googleTranslation}"<br>
        <b>MyMemory:</b> "${myMemoryTranslation}"<br>
        <b>Comparing translations using OpenAI...</b>
      `);

      compareTranslationsWithOpenAI(inputText, googleTranslation, myMemoryTranslation)
        .then((comparisonResult) => {
          $("#apiResponse").append(`<br><b>Comparison Result (OpenAI):</b><br>${comparisonResult}`);
        })
        .catch(() => {
          // Fallback to evaluateTranslations if OpenAI fails
          const fallbackResult = evaluateTranslations(inputText, googleTranslation, myMemoryTranslation);
          $("#apiResponse").append(`
            <br><b>OpenAI Error:</b> Using fallback evaluation.<br>
            <b>Fallback Evaluation:</b><br>${fallbackResult}
          `);
        });
    })
    .catch(() => {
      $("#apiResponse").html("<font color=red><b>Error in translation APIs.</b></font>");
    });
}

// Google Translate API Integration
function callGoogleTranslateAPI(text, sourceLang, targetLang) {
  return new Promise((resolve, reject) => {
    const params = new URLSearchParams({
      client: "gtx",
      sl: sourceLang,
      tl: targetLang,
      dt: "t",
      q: text,
    });

    $.ajax({
      type: "GET",
      url: `${googleTranslateURL}?${params}`,
      success: (response) => resolve(response[0][0][0]),
      error: () => reject(),
    });
  });
}

// MyMemory API Integration
function callMyMemoryAPI(text, sourceLang, targetLang) {
  return new Promise((resolve, reject) => {
    const params = new URLSearchParams({
      q: text,
      langpair: `${sourceLang}|${targetLang}`,
    });

    $.ajax({
      type: "GET",
      url: `${myMemoryTranslateURL}?${params}`,
      success: (response) => resolve(response.responseData.translatedText),
      error: () => reject(),
    });
  });
}

// OpenAI API Integration
function compareTranslationsWithOpenAI(originalText, googleTranslation, myMemoryTranslation) {
  return new Promise((resolve, reject) => {
    if (!openaiApiKey) {
      reject();
      return;
    }

    const prompt = `
      You are a translation expert. Analyze which translation is better and explain why.
      Original: "${originalText}"
      Google Translate: "${googleTranslation}"
      MyMemory: "${myMemoryTranslation}"`;

    const data = {
      model: openaiModel,
      messages: [{ role: "user", content: prompt }],
    };

    $.ajax({
      type: "POST",
      url: openaiURL,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openaiApiKey}`,
      },
      data: JSON.stringify(data),
      success: (response) => resolve(response.choices[0].message.content),
      error: () => reject(),
    });
  });
}

// Custom function to evaluate translations by Sanidhya Shrivastava
function evaluateTranslations(originalText, translation1, translation2) {
  const metrics = [];

  // Simplified Meaning Similarity Check using semantic comparison
  const meaningSimilarity = (original, translation) => {
    const cleanText = (text) => text.toLowerCase().replace(/[.,!?]/g, '').split(/\s+/).join(' ');

    const lowerOriginal = cleanText(original);
    const lowerTranslation = cleanText(translation);

    const phrases = [
      ["hello", "how are you", "fine", "thank you", "now"],
      ["good", "yes", "no", "thanks", "please"],
    ];

    let matchScore = 0;
    phrases.forEach((phraseSet) => {
      phraseSet.forEach((phrase) => {
        if (lowerTranslation.includes(phrase)) {
          matchScore += 1;
        }
      });
    });

    return matchScore;
  };

  const meaningScore1 = meaningSimilarity(originalText, translation1);
  const meaningScore2 = meaningSimilarity(originalText, translation2);

  metrics.push(`Meaning Similarity (Google): ${meaningScore1}, (MyMemory): ${meaningScore2}`);

  // Length Similarity (simple metric)
  const lengthDiff1 = Math.abs(originalText.length - translation1.length);
  const lengthDiff2 = Math.abs(originalText.length - translation2.length);
  metrics.push(`Length Difference (Google): ${lengthDiff1}, (MyMemory): ${lengthDiff2}`);

  // Punctuation Check
  const punctuationCheck = (text) => {
    return /[.?!]$/.test(text.trim()) ? "Correct" : "Missing punctuation";
  };
  const punctuation1 = punctuationCheck(translation1);
  const punctuation2 = punctuationCheck(translation2);
  metrics.push(`Punctuation Check (Google): ${punctuation1}, (MyMemory): ${punctuation2}`);

  // Determine the final verdict based on meaning similarity first
  let betterTranslation = "Both are equally good";

  if (meaningScore1 > meaningScore2) {
    betterTranslation = "Google Translate is better";
  } else if (meaningScore2 > meaningScore1) {
    betterTranslation = "MyMemory is better";
  } else {
    if (lengthDiff1 < lengthDiff2) {
      betterTranslation = "Google Translate is better";
    } else if (lengthDiff2 < lengthDiff1) {
      betterTranslation = "MyMemory is better";
    } else {
      if (punctuation1 === "Correct" && punctuation2 === "Missing punctuation") {
        betterTranslation = "Google Translate is better";
      } else if (punctuation2 === "Correct" && punctuation1 === "Missing punctuation") {
        betterTranslation = "MyMemory is better";
      }
    }
  }

  metrics.push(`<b>Final Verdict:</b> ${betterTranslation}`);
  return metrics.join("<br>");
}
