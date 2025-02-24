document.addEventListener("DOMContentLoaded", function () {
    const profileForm = document.getElementById("profileForm");
    const editBtn = document.getElementById("editBtn");
    const saveBtn = document.getElementById("saveBtn");

    function loadProfile() {
        const profileData = JSON.parse(localStorage.getItem("profileData"));
        if (profileData) {
            document.getElementById("name").value = profileData.name;
            document.getElementById("email").value = profileData.email;
            document.getElementById("date").value = profileData.date;
            document.getElementById("gender").value = profileData.gender;
            document.getElementById("address").value = profileData.address;
            document.getElementById("qualification").value = profileData.qualification;
            document.getElementById("role").value = profileData.role;
            document.getElementById("willing").value = profileData.willing;
            document.getElementById("teaching").value = profileData.teaching;
        }
    }

    loadProfile();

    editBtn.addEventListener("click", function () {
        profileForm.querySelectorAll("input, textarea").forEach(input => input.removeAttribute("readonly"));
        saveBtn.removeAttribute("disabled");
    });

    profileForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const updatedData = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            address: document.getElementById("address").value,
            gender: document.getElementById("gender").value,
            date: document.getElementById("date").value,
            qualification: document.getElementById("qualification").value,
            role: document.getElementById("role").value,
            willing: document.getElementById("willing").value,
            teaching: document.getElementById("teaching").value
        };

        localStorage.setItem("profileData", JSON.stringify(updatedData));
        alert("Profile updated successfully!");
        window.location.href = "tutor_registration.html";
        location.reload();
    });
});
