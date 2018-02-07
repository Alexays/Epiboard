export default {
	name: "Meteo",
	props: ['settings'],
	size: 2,
	components: {},
	data() {
		return {
			name: "Loading ...",
			position: null,
			meteo_datas: null
		}
	},
	methods: {
		setMeteo(position) {
			var crd = position.coords;
			console.log(crd);
			this.$http.get(`http://apperau.fr/meteo.php?lon=${crd.longitude}&lat=${crd.latitude}`)
			.then((response) => {
				this.meteo_datas = response.data;
				this.name = this.meteo_datas.name;
			}, {headers: {"Access-Control-Allow-Origin": "*"}});
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
