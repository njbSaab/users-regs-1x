import { getVisitorId, getIp } from './utils/browser.js';
import { sendCode, verifyCode } from './index.js';
const { createApp } = Vue;
import { registerAndGetDepositLink } from './api/partner.js';
import { ERROR_MESSAGES } from './utils/errorMessage.js';

createApp({
  data() {
    return {
      name: "",
      email: "",
      code: "",
      showCodePopup: false,
      showAfterPopupSuccess: false,
      showAfterPopupError: false,       
      afterErrorMessage: "",
      loading: false,
      verifying: false,
      errorMessage: "",
      emailError: "",
      visitorId: null,
      userSaved: false,
      successMessage: "",
      clientIp: null,
      skeleton: false,
      finalizing: false,
      trafficParams: {
        tag: '',
        pb: '',
        click_id: '',
        custom_login_link: '',
      }
    };
  },

  async mounted() {
    this.visitorId = await getVisitorId();
    this.clientIp = await getIp();

    const urlParams = new URLSearchParams(window.location.search);

    this.trafficParams.tag = urlParams.get('tag') || '';
    this.trafficParams.pb = urlParams.get('pb') || '';
    this.trafficParams.click_id = urlParams.get('click_id') || '';
    
    const r = urlParams.get('r');
    this.trafficParams.custom_login_link = r ? `/${r}` : '';

    console.log('Parsed traffic params:', this.trafficParams);
    console.log('start work');
  },

  methods: {
    async submitForm(e) {
      e.preventDefault();
      this.emailError = "";
      if (!this.email.includes("@")) {
        this.emailError = ERROR_MESSAGES.enter_your_email;
        return;
      }

      this.loading = true;
      try {
        await sendCode(this.email);
        this.showCodePopup = true;
        this.$nextTick(() => this.$refs.codeInput?.focus());
      } catch (err) {
        this.emailError = ERROR_MESSAGES.internal_server_error;
      } finally {
        this.loading = false;
      }
    },

    async verifyCode() {
      if (!/^\d{6}$/.test(this.code)) {
        this.errorMessage = ERROR_MESSAGES.invalid_code;
        return;
      }

      this.verifying = true;
      this.errorMessage = "";

      try {
        await verifyCode({
          email: this.email,
          code: this.code,
          name: this.name,
        });

        this.showAfterPopupSuccess = true;
        this.showCodePopup = false;
        this.code = "";
      } catch (err) {
        this.errorMessage = ERROR_MESSAGES.invalid_code;
      } finally {
        this.verifying = false;
      }
    },

    closeCodePopup() {
      this.showCodePopup = false;
      this.code = "";
      this.errorMessage = "";
    },
    closeErrorPopup() {
      this.showAfterPopupError = false;
      this.afterErrorMessage = "";
    },

    async closeSuccessPopup() {
          if (this.finalizing) return;

          this.finalizing = true;

          try {
            // ОДИН запрос — сервер сам зарегистрирует И сохранит юзера в БД
            const depositUrl = await registerAndGetDepositLink(
              this.email,
              this.name,              // ← ДОБАВЛЕНО: передаём имя
              this.trafficParams
            );

            window.location.assign(depositUrl);

          } catch (err) {
            console.error('Не удалось зарегистрировать:', err);
            
            let message = ERROR_MESSAGES.registration_error;

            if (err.message && ERROR_MESSAGES[err.message]) {
              message = ERROR_MESSAGES[err.message];
            }
            else if (err.message) {
              if (err.message.includes('Multiple accounts') || err.message.includes('multiple accounts')) {
                message = ERROR_MESSAGES.multiple_accounts;
              }
              else if (err.message.includes('already registered') || err.message.includes('already exists')) {
                message = ERROR_MESSAGES.already_registered;
              }
            }

            this.afterErrorMessage = message;
            this.showAfterPopupError = true;
            this.showAfterPopupSuccess = false;
          } finally {
            this.finalizing = false;
            this.showAfterPopupSuccess = false;
          }
        },
      },

  watch: {
    showCodePopup(val) {
      if (val) this.$nextTick(() => this.$refs.codeInput?.focus());
    },
  },
}).mount("#app");