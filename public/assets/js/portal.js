$(document).ready(function() {
  // show appointment details
  function showDetails() {
    $("#app-details").on("click", function(event) {
      var radioValue = $("input[name='selectedCustomer']:checked").val();
      event.preventDefault();
      $.ajax({
        method: "GET",
        url: "/api/customer-app",
        data: { customerId: radioValue }
      }).then(function(response) {
        $("#custApp").html(response);
      });
    });
  }
  showDetails();

  //search by
  function searchBy() {
    var typeQuery = "";
    $(".dropdown-item").on("click", function() {
      $("#selected").text($(this).text());
      var type = $(this).text();
      switch (type) {
        case "ID":
          typeQuery = "id";
          break;
        case "Last Name":
          typeQuery = "lastName";
          break;
        case "Phone Number":
          typeQuery = "phone";
          break;
        case "Email":
          typeQuery = "email";
          break;
      }
      $("#stype").val(typeQuery);
    });
  }
  searchBy();

  // delete appt
  function deleteApp() {
    $(document).on("click", ".delete", function(event) {
      event.preventDefault();
      var id = $(this).data("delete");
      $(this)
        .closest("tr")
        .remove();
      $.ajax({
        method: "DELETE",
        url: "/api/appointments/" + id,
        data: { id: id }
      });
    });
  }
  deleteApp();

  // edit appt
  function editApp() {
    var appId = "";
    $(document).on("click", ".edit", function(event) {
      event.preventDefault();
      appId = $(this).data("edit");
      $(document).on("click", "#editApptPortalBtn" + appId, function(event) {
        event.preventDefault();
        var note = $("#notes" + appId)
          .val()
          .trim();
        var start_time = $("#datetimepickerportal" + appId)
          .find("input")
          .val()
          .trim();
        if (note === "") {
          note = $("#currentNote" + appId).text();
        }
        if (start_time === "") {
          start_time = $("#currentTime" + appId).text();
        }
        $.ajax({
          method: "PUT",
          url: "/api/appointments",
          data: { id: appId, start_time: start_time, note: note }
        });
        $("#currentNote" + appId).text(note);
        $("#currentTime" + appId).text(start_time);
        $("#notes" + appId).val("");
        $("#datetimepickerportal" + appId)
          .find("input")
          .val("");
      });
    });
  }
  editApp();

  $("#app-Edit").on("click", function(event) {
    event.preventDefault();
    var editID = $("input[name='selectedCustomer']:checked").val();

    $.ajax({
      method: "GET",
      url: "/api/customer/" + editID
    }).then(function(response) {
      var address = response[0].address.split(" ");
      var addLength = address.length;
      address.pop();
      var state = address.pop();
      var city = address.pop();
      var street = address.join(" ");
      $("#custEmailEdit").val(response[0].email);
      $("#custFirstNameEdit").val(response[0].firstName);
      $("#custLastNameEdit").val(response[0].lastName);
      $("#custMiddleNameEdit").val(response[0].mName);
      $("#custAgeEdit").val(response[0].age);
      $("#custGenderEdit").val(response[0].gender);
      $("#custNumberEdit").val(response[0].phone);
      $("#custAddressEdit").val(street);
      $("#custStateEdit option[value=" + state + "]").attr(
        "selected",
        "selected"
      );
      $("#custCityEdit").val(city);
      $("#custZipCodeEdit").val(response[0].zipcode);
    });
  });

  $("#editCustomer").on("click", function(event) {
    event.preventDefault();
    var editCustomer = {};
    var addressEdit = "";
    var editID = $("input[name='selectedCustomer']:checked").val();

    editCustomer.id = editID;
    editCustomer.email = $("#custEmailEdit")
      .val()
      .trim();
    editCustomer.firstName = $("#custFirstNameEdit")
      .val()
      .trim();
    editCustomer.lastName = $("#custLastNameEdit")
      .val()
      .trim();
    editCustomer.mName = $("#custMiddleNameEdit")
      .val()
      .trim();
    editCustomer.age = $("#custAgeEdit")
      .val()
      .trim();
    editCustomer.gender = $("#custGenderEdit option:selected").val();
    editCustomer.phone = $("#custNumberEdit")
      .val()
      .trim();
    addressEdit +=
      $("#custAddressEdit")
        .val()
        .trim() + " ";
    addressEdit +=
      $("#custCityEdit")
        .val()
        .trim() + " ";
    addressEdit += $("#custStateEdit option:selected").val() + " ";
    editCustomer.address = addressEdit;
    editCustomer.zipcode = $("#custZipCodeEdit")
      .val()
      .trim();
    $.ajax({
      method: "PUT",
      url: "/api/new-customer",
      data: editCustomer
    }).then(function(response) {
      var alertmessage = "";
      if (response.errors) {
        response.errors.forEach(function(element) {
          alertmessage +=
            "<p>Please, check your " + element.path + ". It is not valid.</p>";
        });
        Swal.fire({
          type: "error",
          title: "Oops...",
          html: alertmessage
        });
      } else {
        Swal.fire({
          title: "Customer has been edited!",
          showConfirmButton: true
        }).then(function() {
          location.reload();
        });
      }
    });
  });
});
