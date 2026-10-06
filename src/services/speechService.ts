// Dịch vụ nhận diện và phát âm thanh (Web Speech API + Fallbacks)

export class SpeechService {
  private static recognitionInstance: any = null;
  private static synthesisInstance: SpeechSynthesis | null = typeof window !== 'undefined' ? window.speechSynthesis : null;

  // Kiểm tra hỗ trợ Speech Recognition
  public static isRecognitionSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return !!(
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition
    );
  }

  // Khởi tạo và bắt đầu lắng nghe giọng nói
  public static startListening(
    onResult: (transcript: string, isFinal: boolean) => void,
    onError: (error: string) => void,
    onEnd: () => void
  ): { stop: () => void } {
    if (!this.isRecognitionSupported()) {
      onError('Trình duyệt của bạn không hỗ trợ Web Speech API. Bạn có thể gõ văn bản trực tiếp.');
      return { stop: () => {} };
    }

    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (this.recognitionInstance) {
        try {
          this.recognitionInstance.abort();
        } catch {}
      }

      const recognition = new SpeechRecognition();
      this.recognitionInstance = recognition;

      recognition.lang = 'en-US';
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const text = finalTranscript || interimTranscript;
        onResult(text, !!finalTranscript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          onError('Quyền truy cập micro đã bị từ chối. Vui lòng cho phép quyền micro trong trình duyệt.');
        } else if (event.error === 'no-speech') {
          // No speech detected, not fatal
        } else {
          onError(`Lỗi nhận diện âm thanh: ${event.error}`);
        }
      };

      recognition.onend = () => {
        onEnd();
      };

      recognition.start();

      return {
        stop: () => {
          try {
            recognition.stop();
          } catch {}
        },
      };
    } catch (err: any) {
      onError(err?.message || 'Không thể kích hoạt micro.');
      return { stop: () => {} };
    }
  }

  // Dừng lắng nghe
  public static stopListening(): void {
    if (this.recognitionInstance) {
      try {
        this.recognitionInstance.stop();
      } catch {}
      this.recognitionInstance = null;
    }
  }

  // Phát âm thanh văn bản (Text-to-Speech)
  public static speak(
    text: string,
    options?: {
      rate?: number; // 0.75, 1, 1.25
      pitch?: number;
      onEnd?: () => void;
    }
  ): void {
    if (!this.synthesisInstance || typeof window === 'undefined') return;

    // Hủy các câu đang đọc dở
    this.synthesisInstance.cancel();

    if (!text.trim()) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = options?.rate || 1.0;
    utterance.pitch = options?.pitch || 1.0;

    // Chọn giọng tiếng Anh chuẩn nếu có
    const voices = this.synthesisInstance.getVoices();
    const englishVoice = voices.find(
      (v) => (v.lang.startsWith('en-US') || v.lang.startsWith('en-GB')) && !v.name.includes('Google')
    ) || voices.find((v) => v.lang.startsWith('en'));

    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    if (options?.onEnd) {
      utterance.onend = options.onEnd;
    }

    this.synthesisInstance.speak(utterance);
  }

  // Tạm dừng phát âm
  public static pauseSpeaking(): void {
    if (this.synthesisInstance && this.synthesisInstance.speaking) {
      this.synthesisInstance.pause();
    }
  }

  // Tiếp tục phát âm
  public static resumeSpeaking(): void {
    if (this.synthesisInstance && this.synthesisInstance.paused) {
      this.synthesisInstance.resume();
    }
  }

  // Hủy toàn bộ giọng đang đọc
  public static cancelSpeaking(): void {
    if (this.synthesisInstance) {
      this.synthesisInstance.cancel();
    }
  }

  // Kiểm tra đang phát giọng không
  public static isSpeaking(): boolean {
    return !!(this.synthesisInstance && this.synthesisInstance.speaking);
  }
}
