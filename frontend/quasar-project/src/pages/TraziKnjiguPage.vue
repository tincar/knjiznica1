<template>
  <q-page padding>
    <h5>Pronađi knjigu :)</h5>
    <p>Pomoću ove stranice možeš pronaći knjigu!</p>

   
    <q-input v-model="searchQuery" label="Unesite pojam za pretragu" class="q-mb-md" />
    
    <div class="q-mb-md">
      <q-checkbox v-model="searchByTitle" label="Pretražuj po naslovu" />
      <q-checkbox v-model="searchByAuthor" label="Pretražuj po autoru" />
    </div>

    <q-btn label="Traži" @click="searchBooks" color="primary" class="q-mb-md" />


    <q-table
      v-if="filteredBooks.length > 0"
      :rows="filteredBooks"
      :columns="columns"
      row-key="id"
      class="q-mt-md"
    />
    <p v-else>Nema rezultata za pretragu.</p>
  </q-page>
</template>

<script>
export default {
  name: 'SearchBookPage',

  data() {
    return {
      // Dummy podaci o knjigama
      books: [
        { id: 1, title: 'Knjiga 1', author: 'Autor 1', year: 2020 },
        { id: 2, title: 'Knjiga 2', author: 'Autor 2', year: 2021 },
        { id: 3, title: 'Knjiga 3', author: 'Autor 3', year: 2022 },
        { id: 4, title: 'Knjiga 4', author: 'Autor 1', year: 2019 },
        { id: 5, title: 'Knjiga 5', author: 'Autor 2', year: 2018 }
      ],

      // Pretraživačke varijable
      searchQuery: '',
      searchByTitle: false,
      searchByAuthor: false,

      // Definicija stupaca tablice
      columns: [
        { name: 'title', label: 'Naslov', align: 'left', field: row => row.title },
        { name: 'author', label: 'Autor', align: 'left', field: row => row.author },
        { name: 'year', label: 'Godina', align: 'center', field: row => row.year }
      ],

      // Filtrirani podaci (rezultati pretrage)
      filteredBooks: []
    };
  },

  methods: {
    
    searchBooks() {
      
      if (!this.searchByTitle && !this.searchByAuthor) {
        this.$q.notify({
          type: 'negative',
          message: 'Odaberite barem jedan kriterij za pretragu.',
        });
        return;
      }

   
      this.filteredBooks = this.books.filter(book => {
        const query = this.searchQuery.toLowerCase();
        const matchesTitle = this.searchByTitle && book.title.toLowerCase().includes(query);
        const matchesAuthor = this.searchByAuthor && book.author.toLowerCase().includes(query);
        
        return matchesTitle || matchesAuthor;
      });
    }
  }
}
</script>
