<template>
  <div>
    <section class="applications">
      <div class="measures__wrapper">
        <h4 class="primary-title text-center">
          Заявления
          <span :class="'badge badge-' + theme">{{ apps.totalElements }}</span>
        </h4>
        <ApplicationsCardsList
          :apps-cards-list="apps"
          :items-total="itemsTotal"
          :page="page"
          :page-size="pageSize"
          :items-per-page="itemsPerPage"
          :theme="theme"
          @change-page-size="changePageSize($event)"
          @change-page="changePage"
          @get-app-form="getStartForm($event)"
        ></ApplicationsCardsList>
      </div>
    </section>

    <b-modal
      id="edit-app"
      :title="appForm.form.name"
      size="xl"
      hide-footer
      no-stacking
      @close="cleanAppForm"
    >
      <template v-if="isResponse">
        <!--        <div v-if="isAlertVisible" class="alert alert-success" role="alert">-->
        <!--          {{ successComment }}-->
        <!--        </div>-->
        <div class="row">
          <div class="col-10">
            <Form
              :form="appForm.form.scheme"
              :submission="appForm"
              language="ru"
              :options="{
                readOnly: !appForm.active,
                i18n: formOptions.i18n,
              }"
              ref="vueForm"
            />
          </div>
          <div
            v-if="appForm.form.actions && appForm.form.actions.length > 0"
            class="col-2"
          >
            <template v-for="action of appForm.form.actions">
              <template v-if="appForm.active || action.alwaysActive">
                <button
                  v-if="action.backAction"
                  :key="action.id"
                  type="button"
                  class="btn btn-block btn-primary"
                  @click="invokeAction(action.id, true)"
                >
                  {{ action.name }}
                </button>
                <button
                  v-else
                  :key="action.id"
                  type="button"
                  class="btn btn-block btn-primary"
                  @click="invokeAction(action.id)"
                >
                  {{ action.name }}
                </button>
              </template>
            </template>
          </div>
        </div>
      </template>

      <template v-else-if="isLoading">
        <div class="card">
          <div class="card-body text-center">
            <div class="spinner-border text-primary" role="status">
              <span class="sr-only">Loading...</span>
            </div>
            <div>{{ loadingComment }}</div>
          </div>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script>
import ApplicationsCardsList from "@/components/ApplicationsCardsList";
import { Form } from "vue-formio";
import axios from "axios";

export default {
  name: "Applications",

  components: {
    ApplicationsCardsList,
    Form,
  },

  props: ["url", "theme"],

  data() {
    return {
      apps: [],
      itemsTotal: 0,
      page: 1,
      pageSize: 10,
      itemsPerPage: [10, 25, 50],
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
            august: "Август",
            september: "Сентябрь",
            october: "Октябрь",
            november: "Ноябрь",
            december: "Декабрь",
            next: "Далее",
            previous: "Назад",
            cancel: "Отмена",
            submit: "Отправить",
          },
        },
      },
      isLoading: false,
      loadingComment: "Загрузка заявления",
      successComment: "Заявление успешно загружено!",
      isResponse: false,
      isAlertVisible: false,
      isValidFormData: false,
      isFirstLoad: true,
    };
  },

  methods: {
    getApps(
      page,
      pageSize,
      sortCol = "id",
      sortDesc = true,
      userList = true,
      active = false
    ) {
      axios
        .get(
          this.url +
            "app/get-apps?pageNum=" +
            (page - 1) +
            "&pageSize=" +
            pageSize +
            "&sortCol=" +
            sortCol +
            "&sortDesc=" +
            sortDesc +
            "&userList=" +
            userList +
            "&active=" +
            active,
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          this.apps = response.data;
          this.itemsTotal = response.data.totalElements;
          console.log("Список заявлений");
          console.log(this.apps);
        });
    },

    // Стартовая форма заявления
    getStartForm(id) {
      this.isResponse = false;
      this.isLoading = true;
      this.loadingComment = "Загрузка формы заявления";
      setTimeout(this.getForm, 1000, id);
    },
    getForm(id) {
      axios
        .get(this.url + "app/get-appData?id=" + id)
        .then((response) => {
          console.log("Стартовая форма");
          console.log(response);
          const newForm = response.data;
          newForm.data = JSON.parse(newForm.data);
          newForm.form.scheme = JSON.parse(newForm.form.scheme);
          this.appForm = newForm;
        })
        .then(() => {
          this.isResponse = true;
          this.isLoading = false;
          this.isAlertVisible = true;
          setTimeout(this.hideAlert, 3000);
        });
    },

    hideAlert() {
      this.isAlertVisible = false;
    },

    validateForm() {
      return this.$refs.vueForm.formio.checkValidity(
        this.$refs.vueForm.formio.submission.data
      );
    },

    invokeAction(actionId, isBackAction = false) {
      console.log("Выполнение действия");
      this.isFirstLoad = false;
      this.isValidFormData = this.validateForm();
      console.log("Валидность формы:" + this.isValidFormData);
      if (this.isValidFormData) {
        this.loadingComment = "Отправка данных заявления";
        this.isResponse = false;
        this.isLoading = true;
        setTimeout(this.invoke, 1000, actionId, isBackAction);
      } else {
        this.$refs.vueForm.formio.submit();
      }
    },
    invoke(actionId, isBackAction = false) {
      const request = {
        actionId: actionId,
        userId: 13,
        appId: this.appForm.id,
        data: JSON.stringify(this.appForm.data),
      };
      axios
        .post(this.url + "app/action-invoke", request)
        .then((response) => {
          console.log("Ответ на экшн");
          console.log(response);
          if (response.data.responseObject) {
            let fileApp = JSON.parse(response.data.responseObject);
            console.log("Объект файла");
            console.log(fileApp);
            let link = document.createElement("a");
            link.setAttribute("download", fileApp.fileName);
            link.setAttribute(
              "href",
              "data:application/octet-stream;base64," + fileApp.fileData
            );
            link.click();
          } else {
            if (isBackAction) {
              this.cleanAppForm();
            } else {
              this.getNextForm(response);
            }
          }
        })
        .then(() => {
          this.isResponse = true;
          this.isLoading = false;
          this.isAlertVisible = true;
          this.isFirstLoad = true;
          setTimeout(this.hideAlert, 3000);
        });
    },

    // Переход к следующей форме (стандартное дейтвие)
    getNextForm(response) {
      console.log("Следующая форма");
      console.log(response);
      let nextForm = response.data.applicationDTO;
      nextForm.data = JSON.parse(nextForm.data);
      nextForm.form.scheme = JSON.parse(nextForm.form.scheme);
      this.appForm = nextForm;
      this.successComment = "Заявление отправлено!";
    },

    cleanAppForm() {
      this.$bvModal.hide("edit-app");
      this.isLoading = false;
      this.loadingComment = "Загрузка формы заявления";
      this.successComment = "Форма заявления успешно загружена!";
      this.isResponse = true;
      this.isAlertVisible = true;
      this.isValidFormData = false;
      this.isFirstLoad = true;
    },

    changePageSize(newPageInfo) {
      this.page = newPageInfo[0];
      this.pageSize = newPageInfo[1];
      this.getApps(this.page, this.pageSize);
      this.scrollToTop();
    },

    changePage(page) {
      this.page = page;
      this.getApps(this.page, this.pageSize);
      this.scrollToTop();
    },

    scrollToTop() {
      window.scrollTo(0, 0);
    },
  },

  mounted: function () {
    this.getApps(this.page, this.pageSize);
  },
};
</script>

<style lang="scss">
.btn {
  word-wrap: break-word;
}
</style>
