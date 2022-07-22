<template>
  <header class="'header sticky-top shadow bg-primary">
    <div class="container">
      <nav class="navbar navbar-expand navbar-dark bg-primary px-0">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item">
            <router-link to="/" class="nav-link">Меры поддержки</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/account_info" class="nav-link"
              >Личный кабинет</router-link
            >
          </li>
        </ul>
        <button class="btn btn-light btn-sm" @click="$emit('sign-action')">
          {{ authUser ? "Выход" : "Вход" }}
        </button>
      </nav>
    </div>
  </header>
</template>

<script>
export default {
  name: "Header",
  props: ["auth-user"],
};
</script>
