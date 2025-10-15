import { GoogleGenAI, Type, Chat } from "@google/genai";
import { ServiceDetails } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. The application might not work as expected.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY as string });

let chat: Chat | null = null;

export const startChatSession = () => {
  // Note: The schema is defined above but not used here to allow for flexible text/JSON responses.
  const systemInstruction = `Anda adalah asisten virtual Mal Pelayanan Publik (MPP) Kabupaten Pandeglang. Tugas Anda adalah memberikan informasi yang akurat dan membantu berdasarkan konteks percakapan.
  
  ATURAN KETAT:
  1.  **RESPONS JSON UNTUK PERMINTAAN DETAIL:** Jika pertanyaan pengguna secara eksplisit meminta detail layanan (contoh: 'syarat buat KTP', 'cara perpanjang SIM'), Anda WAJIB merespons HANYA dalam format JSON yang valid. JSON tersebut HARUS menggunakan nama kunci (keys) persis seperti ini:
      - \`namaLayanan\` (string)
      - \`persyaratan\` (array of strings)
      - \`sistemMekanismeProsedur\` (array of strings)
      - \`jangkaWaktu\` (string)
      - \`lokasiGerai\` (string)
      - \`biaya\` (string, opsional)
      - \`dasarHukum\` (array of strings, opsional)
      - \`catatanTambahan\` (string, opsional)
      Contoh struktur yang SALAH dan DILARANG: \`{"layanan": "KTP", "detail": {...}}\`.
      Contoh struktur yang BENAR dan WAJIB: \`{"namaLayanan": "Penerbitan KTP Elektronik Baru", "persyaratan": ["Fotokopi KK"], ...}\`.
      JANGAN tambahkan teks penjelasan apapun di luar objek JSON.
  2.  **RESPONS TEKS UNTUK PERTANYAAN LANJUTAN:** Jika pengguna menanyakan pertanyaan lanjutan tentang layanan yang baru saja dibahas (misalnya, setelah Anda memberikan detail KTP, pengguna bertanya 'apakah bisa online?' atau 'kalau tanpa surat pengantar RT bisa?'), jawab secara natural dalam bentuk teks biasa. Gunakan informasi yang ada untuk menjawab, dan akui jika Anda tidak memiliki detail spesifik tersebut.
  3.  **RESPONS TEKS UNTUK PERTANYAAN UMUM:** Jika pertanyaan adalah sapaan atau pertanyaan umum tentang MPP (contoh: 'MPP buka jam berapa?', 'lokasinya di mana?', 'apakah sabtu buka?'), jawablah sebagai teks biasa dengan ramah dan informatif. JANGAN gunakan format JSON untuk ini.
  4.  **TOLAK PERTANYAAN TIDAK RELEVAN:** Jika pertanyaan sama sekali tidak relevan dengan layanan publik atau MPP Pandeglang, tolak dengan sopan. Contoh: 'Maaf, saya hanya bisa memberikan informasi seputar layanan di MPP Pandeglang. Ada layanan yang bisa saya bantu?'
  5.  **ATURAN FORMAT JSON:** Jangan pernah menyertakan markdown seperti \`\`\`json di awal atau \`\`\` di akhir respons JSON Anda.
  
  Informasi Tambahan untuk Jawaban Anda:
  - Jam Operasional: Senin - Jumat, pukul 08:00 - 15:00 WIB.
  - Hari Libur: Sabtu, Minggu, dan tanggal merah libur.
  - Lokasi: Jl. Jenderal Sudirman No. 1, Pandeglang, Banten.
  - Layanan Online: Untuk pertanyaan tentang pendaftaran 'online', arahkan pengguna untuk memeriksa situs web resmi instansi terkait (misalnya, M-Paspor untuk imigrasi), karena MPP adalah lokasi pelayanan fisik untuk verifikasi dan proses akhir.`;
  
  chat = ai.chats.create({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction,
      // By removing responseMimeType and responseSchema, we allow the model
      // to follow the system instruction to reply with either JSON or plain text.
    },
  });
};

export const sendMessageToChat = async (
  message: string,
  onStream?: (chunk: string) => void
): Promise<ServiceDetails | string> => {
  if (!chat) {
    startChatSession();
  }

  try {
    // Use streaming if callback is provided
    if (onStream) {
      const stream = await (chat as Chat).sendMessageStream({ message });
      let fullText = '';
      
      for await (const chunk of stream) {
        const chunkText = chunk.text || '';
        fullText += chunkText;
        onStream(chunkText);
      }
      
      const trimmedText = fullText.trim();
      
      if (!trimmedText) {
        throw new Error("API returned an empty response.");
      }

      // Parse JSON if applicable
      if (trimmedText.startsWith('{') && trimmedText.endsWith('}')) {
        try {
          const data = JSON.parse(trimmedText);
          if (data.namaLayanan && data.persyaratan) {
            return data as ServiceDetails;
          }
        } catch (e) {
          console.warn("Response looked like JSON but failed to parse. Treating as text.", trimmedText);
        }
      }
      
      return trimmedText;
    }
    
    // Fallback to non-streaming response
    const response = await (chat as Chat).sendMessage({ message });
    const textResponse = response.text;
    
    if (typeof textResponse !== 'string') {
      console.error("API response did not contain a valid text property:", response);
      throw new Error("Invalid response from API. The response was not text.");
    }
    
    const trimmedText = textResponse.trim();

    if (!trimmedText) {
      throw new Error("API returned an empty response.");
    }

    if (trimmedText.startsWith('{') && trimmedText.endsWith('}')) {
        try {
            const data = JSON.parse(trimmedText);
            if (data.namaLayanan && data.persyaratan) {
              return data as ServiceDetails;
            }
        } catch (e) {
            console.warn("Response looked like JSON but failed to parse. Treating as text.", trimmedText);
        }
    }
    
    return trimmedText;

  } catch (error) {
    console.error("Error processing chat message:", error);
    return "Maaf, terjadi sedikit kendala pada sistem. Bisakah Anda mencoba bertanya dengan cara lain?";
  }
};