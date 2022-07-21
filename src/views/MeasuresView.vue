<template>
  <div>
    <Header :theme="theme" />
    <section class="measures">
      <div class="container">
        <h4 class="title-primary text-center">
          Меры поддержки
          <span :class="'badge badge-' + theme">{{ itemsTotal }}</span>
        </h4>
        <div class="row justify-content-center mb-3">
          <div class="col">
            <MeasuresCardsList
              :measures-cards-list="measuresCardsList"
              :items-total="itemsTotal"
              :page="page"
              :page-size="pageSize"
              :items-per-page="itemsPerPage"
              :theme="theme"
              @change-page-size="changePageSize($event)"
              @change-page="changePage"
            ></MeasuresCardsList>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import MeasuresCardsList from "@/components/MeasuresCardsList";
import axios from "axios";
import Header from "../components/Header";

export default {
  name: "MeasuresView",

  components: {
    Header,
    MeasuresCardsList,
  },

  props: ["url", "theme"],

  data() {
    return {
      searchText: "",
      tags: [],
      selectedFilters: [],
      measuresCardsList: [],
      itemsTotal: 0,
      page: 1,
      pageSize: 10,
      itemsPerPage: [10, 25, 50],
      chatIsActive: false,
      inputText: "",
      replics: [
        {
          id: 1,
          author: "bot",
          content:
            "Я - чат-бот Василий. Я помогу Вам с поиском меры поддержки.",
        },
        {
          id: 2,
          author: "bot",
          content: "Укажите, какой объем денежных средств вам требуется?",
        },
        // {id: 3, author: "bot", content: "Вот что найдено по слову"},
        // {id: 4, author: "user", content: "А теперь рыбалка",},
        // {id: 5, author: "bot", content: "К сожалению, ничего не найдено",},
      ],
      faq: [
        {
          id: 1,
          keywords: ["covid", "ковид", "корона"],
          answers: [
            { content: "Запись на вакцинацию", link: "https://google.com" },
            { content: "Сертификат вакцинированного", link: "https://ya.ru" },
            { content: "Мои QR-коды", link: "https://ya.ru" },
          ],
        },
        {
          id: 2,
          keywords: ["спорт"],
          answers: [
            {
              content: "Присвоение спортивных разрядов",
              link: "https://google.com",
            },
            {
              content: "Присвоение квалификационных категорий спортивных судей",
              link: "https://google.com",
            },
            {
              content:
                "Государственная регистрация региональных общественных организаций или структурных подразделений (региональных отделений) общероссийской спортивной федерации",
              link: "https://google.com",
            },
          ],
        },
        {
          id: 3,
          keywords: ["грант", "гранты"],
          answers: [
            {
              content:
                "Гранты в форме субсидий в сфере научной и инновационной деятельности",
              link: "./subsidyinfo1",
            },
            {
              content:
                "Гранты в форме субсидии на развитие инновационного проекта",
              link: "./subsidyinfo2",
            },
            {
              content:
                "Гранты субъектам малого и среднего предпринимательства на реализацию проектов в приоритетных сферах экономики",
              link: "./subsidyinfo3",
            },
          ],
        },
        {
          id: 4,
          keywords: ["субсидия", "субсидии"],
          answers: [
            {
              content:
                "Гранты в форме субсидий в сфере научной и инновационной деятельности",
              link: "./subsidyinfo1",
            },
            {
              content:
                "Гранты в форме субсидии на развитие инновационного проекта",
              link: "./subsidyinfo2",
            },
          ],
        },
        {
          id: 5,
          keywords: ["инновация", "инновации"],
          answers: [
            {
              content:
                "Гранты в форме субсидий в сфере научной и инновационной деятельности",
              link: "./subsidyinfo1",
            },
            {
              content:
                "Гранты в форме субсидии на развитие инновационного проекта",
              link: "./subsidyinfo2",
            },
          ],
        },
        {
          id: 6,
          keywords: ["наука"],
          answers: [
            {
              content:
                "Гранты в форме субсидий в сфере научной и инновационной деятельности",
              link: "./subsidyinfo1",
            },
          ],
        },
        {
          id: 7,
          keywords: [
            "20000000",
            "20000000 руб",
            "20 000 000",
            "20 000 000 руб",
          ],
          answers: [
            {
              content:
                "Укажите срок оказания поддержки в формате «ДД.ММ.ГГГГ - ДД.ММ.ГГГГ»",
              link: "",
            },
          ],
        },
        {
          id: 7,
          keywords: ["01.01.2022-31.12.2022"],
          answers: [
            {
              content:
                "Субсидия на возмещение части затрат, направленных на проведение комплекса агротехнологических работ, повышение уровня экологической безопасности сельскохозяйственного производства, а также на повышение плодородия и качества почв",
              link: "./subsidyinfo5",
            },
            {
              content:
                "Субсидия на возмещение затрат, понесенных в текущем финансовом году, связанных с закупкой сельскохозяйственной техники",
              link: "./subsidyinfo5",
            },
          ],
        },
      ],
    };
  },

  methods: {
    // Фильтрация и поиск
    getTags() {
      axios.get(this.url + "serv/get-tags").then((response) => {
        this.tags = response.data.content;
      });
    },
    searchMeasures(text) {
      this.searchText = text;
      this.getServises();
      this.searchText = "";
    },
    // Фейковый метод (из-за отсутствия исходных данных), уставливает 2 статических флага в фильтре и осуществляет поиск по указанным тегам
    selectEsia() {
      this.selectedFilters.splice(0, this.selectedFilters.length, 4, 8);
      this.getServises();
    },
    clearFilter() {
      this.selectedFilters.splice(0, this.selectedFilters.length);
      this.getServises();
    },

    // Получение списка мер
    getServises() {
      axios
        .get(this.url + "serv/get-services" + this.queryParams)
        .then((response) => {
          this.measuresCardsList = response.data.content;
          this.itemsTotal = response.data.totalElements;
          console.log(response);
          window.scrollTo(0, 0);
        });
    },

    // Пагинация
    changePageSize(newPageInfo) {
      this.page = newPageInfo[0];
      this.pageSize = newPageInfo[1];
      this.getServises();
    },
    changePage(page) {
      console.log(page);
      this.page = page;
      this.getServises();
    },

    // Чат-бот
    chatActivation() {
      this.chatIsActive = true;
    },
    chatDisactivation() {
      this.chatIsActive = false;
    },
    addQuest(inputValue) {
      let quest = {
        id: this.replics.length + 1,
        author: "user",
        content: inputValue,
      };
      this.replics.push(quest);
      let answer;
      let answers;
      this.faq.forEach(function (item) {
        item.keywords.forEach(function (i) {
          if (inputValue.trim().toLowerCase() === i) {
            answers = item.answers;
          }
        });
      });
      if (answers) {
        let links = answers.map(function (someth) {
          let ans = { link: someth.link, content: someth.content };
          return ans;
        });
        answer = {
          author: "bot",
          content: "",
          findedAnswers: links,
        };
      } else {
        answer = {
          author: "bot",
          content: "Извините, я ничего не нашёл.",
        };
      }
      answer.id = this.replics.length + 1;
      this.replics.push(answer);
    },
  },

  computed: {
    queryParams: function () {
      let query =
        "?pageNum=" +
        (this.page - 1) +
        "&pageSize=" +
        this.pageSize +
        "&sortCol=id&sortDesc=false&active=true";
      if (this.selectedFilters.length) {
        this.selectedFilters.forEach((tag) => {
          query += "&tags=" + tag;
        });
      }
      if (this.searchText) {
        query += "&name=" + this.searchText;
      }
      return query;
    },
    replicsList: function () {
      if (this.chatIsActive) {
        return this.replics;
      } else {
        return this.replics.filter((item) => item.id === 1);
      }
    },
  },

  mounted: function () {
    this.getTags();
    this.getServises();
  },
};
</script>
