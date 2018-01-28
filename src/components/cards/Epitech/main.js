const API = 'https://intra.epitech.eu';

export default {
  name: 'Epitech',
  props: ['settings'],
  components: {},
  data() {
    return {
      user: {
        loading: true,
      },
      projects: {
        loading: true,
      },
    };
  },
  methods: {
    parseDate(epiDate) {
      const date = epiDate.replace(', ', '/').replace('h', '/').split('/');
      const parsed = new Date(date[2], date[1] - 1, date[0], date[3], date[4]);
      return parsed;
    },
    getUserInfo() {
      this.axios.get(`${API}/user/?format=json`)
        .then((response) => {
          if (!response.data) return;
          this.user = response.data;
          this.user.loaded = true;
        }).finally(() => {
          this.user.loading = false;
        });
    },
    getProjects() {
      this.axios.get(`${API}/?format=json`)
        .then((response) => {
          if (!response.data) return;
          this.projects = response.data.board.projets
            .filter(f => f.timeline_barre < 100
              && !f.date_inscription && this.parseDate(f.timeline_start) <= new Date())
            .slice(0, 5)
            .sort((a, b) => this.parseDate(a.timeline_end) > this.parseDate(b.timeline_end));
          this.projects.loaded = true;
        }).finally(() => {
          this.projects.loading = false;
        });
    },
  },
  mounted() {
    this.getUserInfo();
    this.getProjects();
  },
};
