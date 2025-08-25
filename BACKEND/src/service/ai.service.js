
const { GoogleGenAI } = require("@google/genai");

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({});




async function generateCaption(base64ImageFile){
const contents = [
{ inlineData: {
mimeType: "image/jpeg",
data: base64ImageFile,},
},
{ text: "Caption this image."}];



const response = await ai.models.generateContent({
model: "gemini-2.5-flash",
contents: contents,
config : {
    systemInstruction : `you are an expert in generating captions for images.
    captions shound be short and should be of maximum two lines , u can use emojis
    use desi language to add humor.
    add some dark humor if possible. 
    `,
}
});
return response.text
}



module.exports = generateCaption
