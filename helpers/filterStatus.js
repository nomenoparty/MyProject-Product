module.exports = (query) => {
	let filterStatus = [
		{
			name: "Tất cả",
			status: "",
			class: ""
		},
		{
			name: "Hoạt động",
			status: "active",
			class: ""
		},
		{
			name: "Không hoạt động",
			status: "inactive",
			class: ""
		}
	];

	if(query.status){
		const index = filterStatus.findIndex(item => query.status === item.status);

		filterStatus[index].class = "active";
	}else{
		const index = filterStatus.findIndex(item => item.status == "");

		filterStatus[index].class = "active";
	}

	return filterStatus;
}