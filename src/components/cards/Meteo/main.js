export default {
	name: "Meteo",
	props: ['settings'],
	size: 2,
	components: {},
	data() {
		return {
			name: "Loading ...",
			position: null,
			meteo_datas: null,
			API: "http://api.openweathermap.org/data/2.5/weather",
			app_id: "0c9042777e3128fab0244da248184801"
		}
	},
	methods: {
		setMeteo(position) {
			var crd = position.coords;
			console.log(crd);
			this.$http.get(`${this.API}?lat=${crd.latitude}&lon=${crd.longitude}&units=metric&appid=${this.app_id}`)
			.then((response) => {
				this.meteo_datas = response.data;
				this.name = this.meteo_datas.name;
			});
		}
	},
	mounted() {
		if (navigator.geolocation) {
			let that = this;
			navigator.geolocation.getCurrentPosition(this.setMeteo,
				function(error) {
					that.name = "Error, sorry";
					console.log(error);
				},
				{timeout: 30000, enableHighAccuracy: true, maximumAge: 75000}
			);
		}  else
		this.name = "For now I need your positions.";
		this.name = "Meteo";
	}
}
