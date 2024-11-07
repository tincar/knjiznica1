<template>
  <q-page padding>
    
    <h5>Popis knjiga</h5>
    <p>Ovdje se nalazi popis knjiga</p>

   
    <q-table :rows="books" :columns="columns" row-key="id" class="q-mt-md" />
  </q-page>
</template>

<script>
export default {
  name: "BookListPage",

  data() {
    return {
      
      books: [
        { id: 1, title: "Bambi", author: "Tin", year: 2000 },
        { id: 2, title: "Spiderman", author: "James", year: 2021 },
        { id: 3, title: "Dog", author: "Patrick", year: 1989 },
      ],


      columns: [
        {
          name: "title",
          label: "Naslov",
          align: "left",
          field: (row) => row.title,
        },
        {
          name: "author",
          label: "Autor",
          align: "left",
          field: (row) => row.author,
        },
        {
          name: "year",
          label: "Godina",
          align: "center",
          field: (row) => row.year,
        },
      ],
    };
  },
};
</script>
