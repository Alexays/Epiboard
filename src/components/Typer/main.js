// @vue/component
export default {
  props: {
    text: {
      type: Array,
      default() {
        return [];
      },
    },
    startDelay: {
      type: Number,
      default: 200,
    },
    speed: {
      type: Number,
      default: 70,
    },
    cursor: {
      type: Boolean,
      default: true,
    },
    cursorSymbol: {
      type: String,
      default: '|',
    },
    fullErase: {
      type: Boolean,
      default: false,
    },
    eraseDelay: {
      type: Number,
      default: 300,
    },
    repeat: {
      type: Number,
      default: Infinity,
    },
    textField: {
      type: Boolean,
      default: false,
    },
  },
  userTyped: false,
  data() {
    return {
      typePos: 0,
      isTyping: false,
      isWaiting: false,
      currentWordPos: null,
      currentWord: null,
      typing: null,
      isFullErasing: false,
      repeatCounter: 0,
      typeInterval: null,
    };
  },
  computed: {
    capitalized() {
      if (!this.typing) return '';
      return `${this.typing[0].toUpperCase()}${this.typing.substring(1)}`;
    },
    url() {
      const se = 'https://www.google.com/#q=';
      if (this.$options.userTyped && this.typing) {
        return `${se}${this.typing}`;
      }
      if (this.currentWord && this.$route.path === '/') {
        return `${se}${this.currentWord}`;
      }
      return null;
    },
    isErasing() {
      return !this.isTyping;
    },
    finishTyping() {
      if (!this.hasStarted || this.typing === null) return false;
      return this.isTyping && this.typing.length >= this.currentWord.length;
    },
    hasStarted() {
      return this.currentWord !== null;
    },
    isErased() {
      if (!this.hasStarted) return false;
      if (this.isErasing && this.typing === null) return true;
      return this.isErasing && this.typing.length <= 0;
    },
    isLastWord() {
      return this.hasStarted && this.currentWordPos >= this.text.length - 1;
    },
    path() {
      return this.$route.path;
    },
  },
  watch: {
    path(val, old) {
      if (val !== old) {
        this.reset();
        this.isTyping = false;
        this.type();
      }
    },
  },
  mounted() {
    if (this.textField) {
      this.$refs.textInput.$refs.input.dir = 'auto';
    }
    this.type();
  },
  beforeDestroy() {
    this.destroyTimers();
  },
  methods: {
    destroyTimers() {
      this.destroyTypeInterval();
      this.destroyCharTimeout();
      this.destroyFullEraseTimeout();
    },
    destroyTypeInterval() {
      if (this.typeInterval) {
        clearInterval(this.typeInterval);
        this.typeInterval = undefined;
      }
    },
    destroyCharTimeout() {
      if (this.charTimeout) {
        clearTimeout(this.charTimeout);
        this.charTimeout = undefined;
      }
    },
    destroyFullEraseTimeout() {
      if (this.fullEraseTimeout) {
        clearTimeout(this.fullEraseTimeout);
        this.fullEraseTimeout = undefined;
      }
    },
    search() {
      const { url } = this;
      if (url) {
        window.open(url, '_self');
      }
    },
    userInput(text) {
      this.destroyTimers();
      this.$options.userTyped = true;
      this.typing = text;
    },
    stop() {
      this.destroyTimers();
      this.$refs.textInput.$refs.input.select();
    },
    next() {
      if (!this.canContinue()) return;
      if (!this.hasStarted) {
        this.currentWordPos = 0;
      } else if (this.isLastWord) {
        this.currentWordPos = 0;
      } else {
        this.currentWordPos += 1;
        this.time += 1;
      }
      this.isWaiting = true;
      this.charTimeout = setTimeout(() => {
        this.destroyCharTimeout();
        this.isWaiting = false;
        this.currentWord = this.text[this.currentWordPos];
        this.typePos = this.isTyping ? this.currentWord.length : 0;
        this.isTyping = !this.isTyping;
      }, this.startDelay);
    },
    canContinue() {
      if (this.isWaiting) return false;
      if (this.isTyping && !this.finishTyping && this.hasStarted) {
        return false;
      }
      if (this.isErasing && !this.isErased && this.hasStarted) {
        return false;
      }
      if (this.isTyping && this.finishTyping) {
        if (this.repeatCounter < this.repeat) {
          this.isTyping = !this.isTyping;
          this.doFullErase();
        } else {
          this.$nextTick(this.destroyTimers);
        }
        return false;
      }
      return true;
    },
    doFullErase() {
      if (this.fullErase && !this.isFullErasing) {
        this.isWaiting = true;

        this.fullEraseTimeout = setTimeout(() => {
          this.isFullErasing = true;
          if (this.textField) {
            // TODO: Cause some unwanted focus
            // this.$refs.textInput.$refs.input.select();
          }
          clearTimeout(this.fullEraseTimeout);
          const tmp = setTimeout(() => {
            clearTimeout(tmp);
            this.reset();
          }, 300);
        }, this.eraseDelay);
      } else {
        this.isWaiting = true;
        const tmp = setTimeout(() => {
          this.isWaiting = false;
          clearTimeout(tmp);
        }, this.eraseDelay);
      }
    },
    reset() {
      this.isWaiting = false;
      this.typing = null;
      this.typePos = 0;
      this.isFullErasing = false;
    },
    type() {
      this.destroyTypeInterval();
      this.typeInterval = setInterval(() => {
        this.next();
        if (this.hasStarted && !this.isWaiting) {
          if (this.isTyping) {
            this.typePos += 1;
          } else {
            this.typePos -= 1;
          }
          if (this.currentWord) {
            this.typing = this.currentWord.substr(0, this.typePos);
          } else {
            this.destroyTypeInterval();
          }
        }
      }, this.speed);
    },
  },
};
