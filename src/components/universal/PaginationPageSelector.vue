<template>
  <div class="paginator__page-selector">
    <nav aria-label="Page navigation example">
      <ul class="pagination justify-content-center">
        <li v-if="activePage > 1" class="page-item">
          <a
            class="page-link"
            href="#"
            aria-label="Предыдущая"
            @click.prevent="$emit('change-page', --activePage)"
          >
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>

        <li v-if="activePage > 2" class="page-item">
          <a
            class="page-link"
            href="#"
            @click.prevent="$emit('change-page', 1)"
          >
            <span aria-hidden="true">1</span>
          </a>
        </li>

        <template v-if="activePage > 3">
          <li v-if="activePage > 4" class="page-item disabled">
            <a class="page-link" href="#" aria-label="Previous">
              <span aria-hidden="true">&#8230;</span>
            </a>
          </li>
          <li v-else class="page-item">
            <a
              class="page-link"
              href="#"
              @click.prevent="$emit('change-page', 2)"
            >
              <span aria-hidden="true">2</span>
            </a>
          </li>
        </template>

        <template v-for="page of pages">
          <li
            v-if="page >= activePage - 1 && page <= activePage + 1"
            :key="page"
            class="page-item"
            :class="{ active: page === activePage }"
          >
            <a
              class="page-link"
              href="#"
              @click.prevent="$emit('change-page', page)"
              >{{ page }}</a
            >
          </li>
        </template>

        <template v-if="activePage < pages - 2">
          <li v-if="activePage < pages - 3" class="page-item disabled">
            <a class="page-link" href="#">
              <span aria-hidden="true">&#8230;</span>
            </a>
          </li>
          <li v-else class="page-item">
            <a
              class="page-link"
              href="#"
              @click.prevent="$emit('change-page', pages - 1)"
            >
              <span aria-hidden="true">{{ pages - 1 }}</span>
            </a>
          </li>
        </template>

        <li v-if="activePage < pages - 1" class="page-item">
          <a
            class="page-link"
            href="#"
            @click.prevent="$emit('change-page', pages)"
          >
            <span aria-hidden="true">{{ pages }}</span>
          </a>
        </li>

        <li v-if="activePage < pages" class="page-item">
          <a
            class="page-link"
            href="#"
            aria-label="Следующая"
            @click.prevent="$emit('change-page', ++activePage)"
          >
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  name: "PaginationPageSelector",
  props: ["pages", "activePage", "theme"],
};
</script>
