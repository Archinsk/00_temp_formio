<template>
  <section class="applcation">
    <div class="container pt-1">
      <template v-if="isResponse">
        <h5 class="title-primary text-center">
          {{ measure.name + ": " + appForm.form.name }}
        </h5>
        <div id="application-form" class="row">
          <div :class="isActionsOnForm ? 'col-10' : 'col-12'">
            <!--            <Form-->
            <!--              :form="appForm.form.scheme"-->
            <!--              :submission="appForm"-->
            <!--              language="ru"-->
            <!--              :options="{-->
            <!--                readOnly: !appForm.active,-->
            <!--                i18n: formOptions.i18n,-->
            <!--              }"-->
            <!--              ref="vueForm"-->
            <!--            />-->
          </div>
          <div v-if="isActionsOnForm" id="action-buttons" class="col-2">
            <template v-for="action of appForm.form.actions">
              <template v-if="appForm.active || action.alwaysActive">
                <button
                  :key="action.id"
                  type="button"
                  class="btn btn-block btn-primary"
                  @click="invokeAction(action)"
                >
                  {{ action.name }}
                </button>
              </template>
            </template>
          </div>
        </div>
      </template>

      <template v-else-if="isLoading">
        <div class="card pt-2 mt-1">
          <div class="card-body text-center">
            <div class="spinner-border text-primary" role="status">
              <span class="sr-only">Loading...</span>
            </div>
            <div>{{ loadingComment }}</div>
          </div>
        </div>
      </template>
    </div>
  </section>
</template>

<script>
// import { Form } from "vue-formio";
// import { Formio as Form } from "../../public/formio.full.min";
import axios from "axios";

export default {
  name: "ApplicationView",
  components: {
    // Form,
  },
  props: ["url", "user", "theme", "authUser"],

  data() {
    return {
      measure: {},
      isResponse: false,
      isLoading: false,
      isFirstLoad: true,
      loadingComment: "",
      appForm: {
        active: false,
        data: {},
        form: {
          actions: [],
          id: 0,
          modelId: 0,
          scheme: {},
        },
        id: 0,
        orderId: "",
        status: "",
      },
      formOptions: {
        i18n: {
          lng: "ru",
          ru: {
            Name: "Имя",
            "Last name": "Фамилия",
            dict: "Тип заявителя",
            "Type to search": "Поиск...",
            "Last name is required": "Фамилия - это обязательное поле",
            "No results found": "Поиск не дал результатов",
            "is required": "обязательное поле",
            Number: "Число",
            Submit: "Подтвердить",
            Layout: "Расположение",
            "Drag and Drop a form component": "Переместите компонент сюда",
            "No Matches Found": "Ничего не найдено",
            "Text Field": "Текстовое поле",
            Email: "Электронная почта",
            "Text Area": "Текстовая область",
            "Phone Number": "Номер телефона",
            Checkbox: "Флажок",
            Select: "Выпадающий список",
            Radio: "Радио кнопка",
            Url: "Ссылка",
            "Data Map": "Ключ - Значение",
            "Data Grid": "Динамический список",
            "Edit Grid": "Сетка данных",
            Table: "Таблица",
            "Date / Time": "Дата / Время",
            Day: "День",
            Time: "Время",
            File: "Файл",
            Signature: "Подпись",
            Content: "Контент",
            Columns: "Столбцы",
            "Field Set": "Набор полей",
            Panel: "Панель",
            Tabs: "Вкладки",
            Well: "Лист",
            Label: "Название",
            "Please fix the following errors before submitting":
              "Пожалуйста исправьте ошибки перед теп как продолжить",
            "Email: Email must be a valid email.": "Не правильный e-mail",
            Placeholder: "Заполнитель",
            Description: "Описание",
            Tooltip: "Подсказка",
            "To add a tooltip to this field,enter text here.":
              "Введите подсказку здесь",
            "Input Mask": "Маска ввода",
            Hidden: "Скрытый",
            "Hide Label": "Скрыть название",
            Save: "Сохранить",
            Cancel: "Отмена",
            Remove: "Удалить",
            Preview: "Предварительный просмотр",
            Disabled: "Отключен",
            Validation: "Проверка",
            Data: "Данные",
            "Property Name": "Имя переменной",
            Display: "Отображение",
            Widget: "Тип компонента",
            required: "обязательно для заполнения",
            pattern: "не соответствует маске!",
            error: "Пожалуйста исправьте ошибки прежде чем продолжить.",
            submitError:
              "Пожалуйста исправьте все ошибки прежде чем продолжить.",
            invalid_regex: "не соответствует маске!",
            mask: "{{field}} не соответствует маске.",
            valueIsNotAvailable: "неправильное значение.",
            Edit: "Редактировать",
            "Label Position": "Расположение",
            "Label Width": "Ширина",
            "Label Margin": "Отступ",
            Prefix: "Прификс",
            Suffix: "Суффикс",
            "Custom CSS Class": "CSS класс",
            "Show Word Counter": "Показать счетчик слов",
            "Show Character Counter": "Показать счетчик символов",
            "Hide Input": "Скрыть ввод",
            "Initial Focus": "Начальный фокус",
            "Allow Spellcheck": "Проверка орфографии",
            "Modal Edit": "Показать во всплывающем окне",
            "Tab Index": "Индекс вкладки",
            Autocomplete: "Автозавершение",
            month: "Месяц",
            day: "День",
            year: "Год",
            january: "Январь",
            february: "Февраль",
            march: "Март",
            april: "Апрель",
            may: "Май",
            june: "Июнь",
            july: "Июль",
            July: "Июль",
            august: "Август",
            september: "Сентябрь",
            october: "Октябрь",
            november: "Ноябрь",
            december: "Декабрь",
            next: "Далее",
            previous: "Назад",
            cancel: "Отмена",
            submit: "Отправить",
            "File Name": "Имя файла",
            Size: "Размер",
            "Add Another": "Добавить",
          },
        },
      },
      isValidFormData: false,
      signActionId: null,
      hashToSign: "",
      signedFileName: "",
      cspIntervalId: null,
      signatureTimeoutId: null,
      signatureIntervalId: null,
    };
  },

  computed: {
    isActionsOnForm: function () {
      return !!(
        this.appForm.form.actions && this.appForm.form.actions.length > 0
      );
    },
  },

  methods: {
    // Информация о мере поддержки
    getMeasure() {
      axios
        .get(this.url + "serv/get-model?id=" + this.$route.params.modelId)
        .then((response) => {
          this.measure = response.data;
          console.groupCollapsed("Информация о мере поддержки");
          console.log(response.data);
          console.groupEnd();
        });
    },

    // Стартовая форма заявления
    getStartForm(id) {
      this.isResponse = false;
      this.isLoading = true;
      if (id) {
        setTimeout(this.getForm, 500, id);
      } else {
        setTimeout(this.getForm, 500);
      }
    },
    getForm(id) {
      let requestUrl;
      if (id) {
        requestUrl = this.url + "app/get-appData?id=" + id;
      } else {
        requestUrl =
          this.url + "serv/get-appData?id=" + this.$route.params.modelId;
      }
      axios
        .get(requestUrl, {
          withCredentials: true,
        })
        .then((response) => {
          const newForm = response.data.applicationDTO;
          newForm.data = JSON.parse(newForm.data);
          newForm.form.scheme = JSON.parse(newForm.form.scheme);
          this.appForm = newForm;
          if (id) {
            console.groupCollapsed("Ранее сохраненная форма обращения");
          } else {
            console.groupCollapsed("Начальная форма обращения");
          }
          console.log(response.data.applicationDTO);
          console.groupEnd();
        })
        .then(() => {
          this.isResponse = true;
          this.isLoading = false;
          // -----
          window.Formio.createForm(
            document.getElementById("formio"),
            this.appForm.form.scheme,
            {
              language: "ru",
            }
          );
          // -----
        });
    },

    validateForm() {
      return this.$refs.vueForm.formio.checkValidity(
        this.$refs.vueForm.formio.submission.data
      );
    },

    invokeAction(action) {
      console.log("Выполнение действия " + action.id);
      this.isFirstLoad = false;
      this.isValidFormData = this.validateForm();
      const isBackAction = action.backAction;
      // Действие "Без проверки" или форма заполнена верно
      if (this.isValidFormData || action.notRequiredAction) {
        if (action.notRequiredAction) {
          console.log("Выполняется действие без проверки");
        } else {
          console.log("Форма валидна");
        }
        this.loadingComment = "Отправка данных заявления";
        this.isResponse = false;
        this.isLoading = true;
        setTimeout(this.invoke, 1000, action, isBackAction);
      } else {
        this.$refs.vueForm.formio.submit();
      }
    },
    invoke(action, isBackAction = false) {
      console.log(isBackAction);
      console.log(typeof isBackAction);
      if (action.signAction) {
        this.signActionId = action.id;
        this.openModalSignature();
        this.cspIntervalId = setInterval(this.cspWaiting, 500);
        return;
      }
      const request = {
        actionId: action.id,
        userId: 0,
        roleId: 0,
        orgId: 0,
        appId: this.appForm.id,
        data: JSON.stringify(this.appForm.data),
      };
      console.log("Тело запроса Action-invoke");
      console.log(request);
      axios
        .post(this.url + "app/action-invoke", request, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        })
        .then((response) => {
          console.log("Ответ на экшн");
          console.log(response);
          if (response.data.responseObject) {
            this.downloadFileFromObject(
              JSON.parse(response.data.responseObject)
            );
          } else {
            if (isBackAction) {
              if (+this.$route.params.appId) {
                this.$router.go(-1);
              } else {
                this.$router.go(-2);
              }
            } else {
              this.getNextForm(response);
            }
          }
        })
        .then(() => {
          this.isResponse = true;
          this.isLoading = false;
          this.isFirstLoad = true;
        });
    },

    // Скачивание файла из объекта
    downloadFileFromObject(fileObject) {
      console.log("Объект файла");
      console.log(fileObject);
      let link = document.createElement("a");
      if (fileObject.fileName) {
        link.setAttribute("download", fileObject.fileName);
      }
      if (fileObject.name) {
        link.setAttribute("download", fileObject.name);
      }
      link.setAttribute(
        "href",
        "data:application/octet-stream;base64," + fileObject.fileData
      );
      link.click();
    },

    // Переход к следующей форме (стандартное дейcтвие)
    getNextForm(response) {
      console.log("Следующая форма");
      console.log(response);
      let nextForm = response.data.applicationDTO;
      nextForm.data = JSON.parse(nextForm.data);
      nextForm.form.scheme = JSON.parse(nextForm.form.scheme);
      this.appForm = nextForm;
    },

    cleanAppForm() {
      this.$bvModal.hide("edit-app");
      this.isLoading = false;
      if (+this.$route.params.appId) {
        this.loadingComment = "Загрузка формы заявления";
      } else {
        this.loadingComment = "Загрузка формы заявления";
      }
      this.isResponse = true;
      this.isValidFormData = false;
      this.isFirstLoad = true;
    },

    cspWaiting() {
      console.log("Проверка загрузки Крипто-ПРО");
      if (window.cspEnabled) {
        this.isResponse = true;
        this.isLoading = false;
        this.isFirstLoad = true;
        clearInterval(this.cspIntervalId);
        console.log("Крипто-ПРО загружен");
      }
    },

    openModalSignature() {
      console.log("---Точка 4");
      console.log("Открытие модального окна");
      this.$refs["modal-signature"].show();
      window.checkExtension(true);
    },

    // Загрузка скриптов КриптоПро
    loadCrypto() {
      var file1 = document.createElement("script");
      file1.setAttribute("type", "text/javascript");
      file1.setAttribute("src", "extensionLoading.js");
      document.getElementsByTagName("head")[0].appendChild(file1);
      var file2 = document.createElement("script");
      file2.setAttribute("type", "text/javascript");
      file2.setAttribute("src", "cadesplugin_api.js");
      document.getElementsByTagName("head")[0].appendChild(file2);
      var file3 = document.createElement("script");
      file3.setAttribute("type", "text/javascript");
      file3.setAttribute("src", "Code.js");
      document.getElementsByTagName("head")[0].appendChild(file3);
      var file4 = document.createElement("script");
      file4.setAttribute("type", "text/javascript");
      file4.setAttribute("src", "pluginLoading.js");
      document.getElementsByTagName("body")[0].appendChild(file4);
    },

    // Подпись файла
    signAction() {
      // window.Common_SignCadesBES('CertListBox');
      // alert("Привет от BV");
      const request = {
        certificate: {
          thumbprint: window.dataToSign.thumbprint,
          subject: window.dataToSign.subject,
          from: window.dataToSign.from,
          validDue: window.dataToSign.validDue,
        },
        actionPayloadDTO: {
          actionId: this.signActionId,
          userId: 0,
          roleId: 0,
          orgId: 0,
          appId: this.appForm.id,
          data: JSON.stringify(this.appForm.data),
        },
      };
      console.log(request);
      axios
        .post(this.url + "app/action-pdfstamp", request, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        })
        .then((response) => {
          console.log("Ответ на экшн");
          console.log(response);
          console.log("Содержимое data.applicationDTO.data");
          console.log(JSON.parse(response.data.applicationDTO.data));
          console.log("Содержимое data.responseObject");
          console.log(JSON.parse(response.data.responseObject));
          console.log("Содержимое hashToSign");
          console.log(JSON.parse(response.data.responseObject).hashToSign);
          this.hashToSign = JSON.parse(response.data.responseObject).hashToSign;
          window.dataToSign.hashToSign = JSON.parse(
            response.data.responseObject
          ).hashToSign;
          console.log(this.hashToSign);
          this.signedFileName = JSON.parse(
            response.data.responseObject
          ).fileName;
          console.log(this.signedFileName);
          window.Common_SignCadesBES("CertListBox");
          let hashField = document.getElementById("DataToSignTxtBox");
          console.log(hashField);
          // hashField.textContent = JSON.parse(response.data.responseObject).hashToSign
          this.signatureIntervalId = setInterval(this.signWaiting, 1000);
          this.$bvModal.hide("signature");
        });
    },

    signWaiting() {
      this.signatureTimeoutId = setTimeout(this.clearSignWaitingTimers, 600000);
      console.log("Проверка наличия подписи");
      if (window.dataToSign.signature) {
        this.requestSignAction();
        this.clearSignWaitingTimers();
        window.dataToSign = {};
      }
    },

    clearSignWaitingTimers() {
      clearInterval(this.signatureIntervalId);
      clearTimeout(this.signatureTimeoutId);
    },

    requestSignAction() {
      console.log(window.dataToSign);
      const request = {
        applicationId: this.appForm.id,
        signature: window.dataToSign.signature,
        hashToSign: this.hashToSign,
        filename: this.signedFileName,
      };
      console.log("Данные отправляемые для подписанного файла");
      console.log(request);
      axios
        .post(this.url + "app/action-insert-signdata", request, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        })
        .then((response) => {
          console.log(response);
          if (response.data.fileData) {
            console.log(response.data);
            this.downloadFileFromObject(response.data);
          }
        })
        .then(() => {
          this.$bvModal.show("signSuccess");
        });
    },
  },

  beforeMount: function () {
    if (+this.$route.params.appId) {
      this.loadingComment = "Загрузка заявления";
    } else {
      this.loadingComment = "Загрузка формы заявления";
    }
  },

  mounted: function () {
    // this.loadCrypto();
    this.getMeasure();
    if (+this.$route.params.appId) {
      this.getStartForm(this.$route.params.appId);
    } else {
      this.getStartForm();
    }
  },
};
</script>
