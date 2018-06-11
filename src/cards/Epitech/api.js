import axios from 'axios';

const API = 'https://intra.epitech.eu';

export default {
  parseCalendarDate(epiDate) {
    const date = epiDate.replace(' ', '-').replace(/:/g, '-').split('-');
    return new Date(date[0], date[1] - 1, date[2], date[3], date[4]);
  },
  parseDate(epiDate) {
    const date = epiDate.replace(', ', '/').replace(':', '/').replace('h', '/').split('/');
    return new Date(date[2], date[1] - 1, date[0], date[3], date[4]);
  },
  getLink(url) {
    return `${API}${url}`;
  },
  getUser() {
    return axios.get(`${API}/user/?format=json`)
      .then(res => res.data);
  },
  isRegistered(project) {
    return axios.get(`${API}${project.title_link}project?format=json`)
      .then(res => !!res.data.user_project_code);
  },
  getProjects() {
    return axios.get(`${API}/?format=json`)
      .then((res) => {
        if (!res.data) return Promise.resolve([]);
        return res.data.board.projets.map((f) => {
          f.link = this.getLink(f.title_link);
          return f;
        });
      });
  },
  getCurrentProjects() {
    return this.getProjects()
      .then((projects) => {
        const data = projects.filter(f => f.timeline_barre < 100 &&
          !f.date_inscription && this.parseDate(f.timeline_start) <= new Date() &&
          this.parseDate(f.timeline_end) > new Date());
        const check = data.map(f => this.isRegistered(f)
          .then((isRegistered) => {
            f.isRegistered = isRegistered;
            return f;
          }));
        return Promise.all(check);
      })
      .then(projects => projects
        .filter(f => f.isRegistered)
        .sort((a, b) => this.parseDate(a.timeline_end) - this.parseDate(b.timeline_end)));
  },
  getPlanning(user) {
    const d = new Date();
    const dString = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    return axios.get(`${API}/planning/load?format=json&start=${dString}&end=${dString}`)
      .then(res => (Array.isArray(res.data) ? res.data : [])
        .filter(f => f.instance_location === user.location));
  },
  getRoom(planning) {
    const d = new Date();
    return planning.filter(f => f.room && f.room.code)
      .map((f) => {
        f.start = this.parseCalendarDate(f.start);
        f.end = this.parseCalendarDate(f.end);
        f.startString = `${f.start.getHours()}h${(`0${f.start.getMinutes()}`).substr(-2)}`;
        f.endString = `${f.end.getHours()}h${(`0${f.end.getMinutes()}`).substr(-2)}`;
        return f;
      }).filter(f => f.end > d)
      .sort((a, b) => a.start - b.start);
  },
  getModule(f) {
    return axios.get(`${API}/module/${f.scolaryear}/${f.code}/${f.codeinstance}/?format=json`)
      .then(res => res.data);
  },
  getGPAPrecision(user) {
    return axios.get(`${API}/course/filter?format=json&course[]=${user.course_code}`)
      .then(res => res.data)
      .then(data => Promise.all(data.map(this.getModule)))
      .then((modules) => {
        let GPA = 0;
        let sum = 0;
        const grade = {
          A: 4, B: 3, C: 2, D: 1, Echec: 0,
        };
        for (let i = 0; i < modules.length; i += 1) {
          const credits = parseInt(modules[i].user_credits, 10);
          if (credits >= 0) {
            if (grade[modules[i].student_grade] >= 0) {
              GPA += credits * grade[modules[i].student_grade];
              sum += credits;
            }
          }
        }
        GPA /= sum;
        return GPA.toFixed(5);
      });
  },
};
