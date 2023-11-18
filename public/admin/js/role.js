const tablePermissions = document.querySelector("[table-permissions]");
if (tablePermissions) {
  const button = document.querySelector("[button-submit]");
  button.addEventListener("click", () => {
    let result = [];
    const rows = tablePermissions.querySelectorAll("[data-name]");
    rows.forEach((item, index) => {
      const name = item.getAttribute("data-name");
      const inputs = item.querySelectorAll("input");
      if (name === "id") {
        inputs.forEach((input) => {
          const value = input.value;
          result.push({
            id: value,
            permissions: [],
          });
        });
      } else {
        inputs.forEach((input, index) => {
          const checked = input.checked;
          if (checked) {
            result[index].permissions.push(name);
          }
        });
      }
    });
    const formChangePermissions = document.querySelector(
      "#form-change-permissions"
    );
    const inputPermissions = formChangePermissions.querySelector("input");
    inputPermissions.value = JSON.stringify(result);
    formChangePermissions.submit();
  });
}

const dataRecords = document.querySelector("[data-records]");
if (dataRecords) {
  const records = JSON.parse(dataRecords.getAttribute("data-records"));
	const tablePermissions = document.querySelector("[table-permissions]");
  records.forEach((record, index) => {
		const permissions = record.permissions;
		permissions.forEach(value => {
			const rows = tablePermissions.querySelector(`tr[data-name='${value}']`);
			const input = rows.querySelectorAll("input")[index];
			input.checked = true;
		});
	});
}
