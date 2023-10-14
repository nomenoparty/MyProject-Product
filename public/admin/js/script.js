const buttonStatus = document.querySelectorAll("[button-status]");
if (buttonStatus.length > 0) {
  let url = new URL(window.location.href);

  buttonStatus.forEach((button) => {
    button.addEventListener("click", (event) => {
   		// event.preventDefault();
      const status = button.getAttribute("button-status");

      if (status != "") {
        url.searchParams.set("status", status);
      } else {
        url.searchParams.delete("status");
      }

      window.location.href = url;
    });
  });
}

const formSearch = document.querySelector("#form-search");
if (formSearch) {
  let url = new URL(window.location.href);
  formSearch.addEventListener("submit", (event) => {
    event.preventDefault();

    const value = event.target.keyword.value;

    if (value != "") {
      url.searchParams.set("keyword", value);
    } else {
      url.searchParams.delete("keyword");
    }

    window.location.href = url.href;
  });
}

const buttonsPagination = document.querySelectorAll("[button-pagination]");
if (buttonsPagination.length > 0) {
	let url = new URL(window.location.href);

	buttonsPagination.forEach(buttons => {
		buttons.addEventListener("click", (event) => {
			// event.preventDefault();
			const page = buttons.getAttribute("button-pagination");

			url.searchParams.set("page", page);

			window.location.href = url.href;
		});
	});
}

const buttonChangeStatus = document.querySelectorAll("[button-change-status]");
if(buttonChangeStatus.length > 0){
  const formChangeStatus = document.querySelector("#form-change-status");
  const path = formChangeStatus.getAttribute("data-path");
  buttonChangeStatus.forEach(button => {
    button.addEventListener("click", () => {
      const currentStatus = button.getAttribute("data-status");
      const id = button.getAttribute("data-id");
      
      const statusChange = currentStatus == "active" ? "inactive" : "active";

      const action = path + `/${statusChange}/${id}?_method=PATCH`;
      formChangeStatus.action = action;
      // formChangeStatus.setAttribute("action", action);
      formChangeStatus.submit();
    });
  });
}

const checkboxMulti = document.querySelector("[checkbox-multi]"); 
if(checkboxMulti){
  const inputCheckAll = document.querySelector("input[name='checkall']");
  const inputIds = document.querySelectorAll("input[name='id']");
  inputCheckAll.addEventListener("click", () => {
    if(inputCheckAll.checked){
      inputIds.forEach(item => {
        item.checked = true;
      });
    }else{
      inputIds.forEach(item => {
        item.checked = false;
      });
    }
  });

  inputIds.forEach(input => {
    input.addEventListener("click", () => {
      const countChecked = document.querySelectorAll("input[name='id']:checked").length;
      if(countChecked == inputIds.length){
        inputCheckAll.checked = true;
      }else{
        inputCheckAll.checked = false;
      }
    });
  });
} 

const formChangeMulti = document.querySelector("[form-change-multi]");
if(formChangeMulti){
  formChangeMulti.addEventListener("submit", (event) => {
    event.preventDefault();
    const checkboxMulti = document.querySelector("[checkbox-multi]"); 
    const inputChecked = checkboxMulti.querySelectorAll("input[name='id']:checked");

    const typeChange = event.target.elements.type.value;
    if(typeChange == "delete-all"){
      const isConfirm = confirm("Bạn có chắc muốn xóa những sản phẩm này?")

      if(!isConfirm){
        return;
      }
    }

    if(inputChecked.length > 0){
      let ids = [];
      inputChecked.forEach(input => {
        const id = input.value;
        if(typeChange == "change-position"){
          const position = input.closest("tr").querySelector("input[name='position']").value;
          ids.push(`${id}-${position}`);
        }else ids.push(id);
      });
      const inputIds = formChangeMulti.querySelector("input[name='ids']");
      inputIds.value = ids.join(", ");
      formChangeMulti.submit();
    }else{
      alert("Vui lòng chọn ít nhất một sản phẩm");
    }
  });
}

const buttonDelete = document.querySelectorAll("[button-delete]");
if(buttonDelete.length > 0){
  const formDeleteItem = document.querySelector("#form-delete-item");
  const path = formDeleteItem.getAttribute("data-path");

  buttonDelete.forEach(button => {
    button.addEventListener("click", () => {
      const confirmDelete = confirm("Bạn muốn xóa sản phẩm này ?");
      if(confirmDelete){
        const id = button.getAttribute("data-id");
        const action = path + `/${id}`;
        // ?_method=DELETE
        formDeleteItem.action = action;
        formDeleteItem.submit();
      }
    });
  });
}

const showAlert = document.querySelector("[show-alert]");
if(showAlert){
  const time = parseInt(showAlert.getAttribute("data-time")) || 3000;
  const closeAlert = showAlert.querySelector("[close-alert]");

  setTimeout(() => {
    showAlert.classList.add("alert-hidden");
  }, time);

  closeAlert.addEventListener("click", () => {
    showAlert.classList.add("alert-hidden");
  });
}

const uploadImage = document.querySelector("[upload-image]");
if(uploadImage){
  const uploadImageInput = uploadImage.querySelector("[upload-image-input");
  const uploadImagePreview = uploadImage.querySelector("[upload-image-preview");

  uploadImageInput.addEventListener("change", (event) => {
    if(event.target.files.length){
      const image = URL.createObjectURL(event.target.files[0]);
      // console.log(image);
      uploadImagePreview.src = image;
    }
  });
}

const sort = document.querySelector("[sort]");
if(sort){
  const sortSelect = sort.querySelector("[sort-select]");
  const sortClear = sort.querySelector("[sort-clear]");
  let url = new URL(window.location.href);
  sortSelect.addEventListener("change", (event) => {
    const value = event.target.value;
    const [sortKey, sortValue] = value.split("-");
      
    url.searchParams.set("sortKey", sortKey);
    url.searchParams.set("sortValue", sortValue);

    window.location.href = url;
  });

  sortClear.addEventListener("click", () => {
    url.searchParams.delete("sortKey");
    url.searchParams.delete("sortValue");

    window.location.href = url;
  });

  const sortKey = url.searchParams.get("sortKey");
  const sortValue = url.searchParams.get("sortValue");

  if(sortKey && sortValue){
    const sortString = `${sortKey}-${sortValue}`;
    const optionSelect = sortSelect.querySelector(`option[value='${sortString}']`);
    optionSelect.selected = true;
  }
}