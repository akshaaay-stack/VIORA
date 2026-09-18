/**
 * VIORA - Kerala Geographic & Hospital Directory Data
 */
const KERALA_DATA = {
  "Ernakulam": {
    localities: ["Kakkanad", "Edappally", "Aluva", "Fort Kochi", "Palarivattom", "Kaloor", "Tripunithura", "Kalamassery"],
    hospitals: [
      "Aster Medcity, Cheranalloor",
      "Amrita Institute of Medical Sciences (AIMS), Edappally",
      "VPS Lakeshore Hospital, Nettoor",
      "Medical Trust Hospital, Pallimukku",
      "Ernakulam Medical Centre, Palarivattom",
      "Govt General Hospital, Ernakulam",
      "Rajagiri Hospital, Chunangamvely, Aluva"
    ]
  },
  "Thiruvananthapuram": {
    localities: ["Pattom", "Kowdiar", "Technopark", "Vellayambalam", "Palayam", "Medical College Area", "Kazhakkoottam"],
    hospitals: [
      "Govt Medical College Hospital, TVM",
      "KIMSHEALTH, Anayara",
      "Ananthapuri Hospitals, Chacka",
      "Cosmopolitan Hospital, Pattom",
      "Sree Chitra Tirunal Institute (SCTIMST)",
      "Govt Women and Children Hospital, Thycaud",
      "PRS Hospital, Karamana"
    ]
  },
  "Kozhikode": {
    localities: ["Mananchira", "Beypore", "Mavoor Road", "Nadakkavu", "Calicut Beach", "Medical College Area", "Feroke"],
    hospitals: [
      "Govt Medical College Hospital, Kozhikode",
      "Baby Memorial Hospital, Arayidathupalam",
      "Aster MIMS Hospital, Govindapuram",
      "Meitra Hospital, Karaparamba",
      "Govt General Hospital (Beach Hospital)",
      "Malabar Medical College, Modakkallur"
    ]
  },
  "Thrissur": {
    localities: ["Swaraj Round", "Guruvayur", "Ayyanthole", "Olarikkara", "Chalakudy", "Kodungallur"],
    hospitals: [
      "Govt Medical College Hospital, Thrissur (Mulamkunnathukavu)",
      "Jubilee Mission Medical College Hospital",
      "Amala Institute of Medical Sciences",
      "Govt General Hospital, Thrissur",
      "Mother Hospital, Olari",
      "Sun Medical Research Centre"
    ]
  },
  "Kottayam": {
    localities: ["Kottayam Town", "Changanassery", "Pala", "Ettumanoor", "Kanjirappally"],
    hospitals: [
      "Govt Medical College Hospital, Gandhinagar, Kottayam",
      "Caritas Hospital, Thellakom",
      "Bharat Hospital, Kottayam",
      "District Hospital, Kottayam",
      "Mar Sleeva Medicity, Palai"
    ]
  },
  "Kollam": {
    localities: ["Chinnakada", "Karunagappally", "Kottarakkara", "Kadakkal", "Punalur"],
    hospitals: [
      "Govt District Hospital, Kollam",
      "Govt Medical College, Parippally",
      "Upasana Hospital, Chinnakada",
      "Bishop Benziger Hospital",
      "Travancore Medicity Hospital"
    ]
  },
  "Malappuram": {
    localities: ["Manjeri", "Kottakkal", "Perinthalmanna", "Tirur", "Nilambur"],
    hospitals: [
      "Govt Medical College Hospital, Manjeri",
      "Aster MIMS Hospital, Kottakkal",
      "Al Shifa Hospital, Perinthalmanna",
      "Moulana Hospital, Perinthalmanna",
      "District Hospital, Nilambur"
    ]
  },
  "Palakkad": {
    localities: ["Palakkad Town", "Ottapalam", "Chittur", "Mannarkkad"],
    hospitals: [
      "District Hospital, Palakkad",
      "Karuna Medical College, Vilayodi",
      "PK DAS Institute of Medical Sciences, Vaniyamkulam",
      "Lakshmi Hospital, Palakkad"
    ]
  },
  "Alappuzha": {
    localities: ["Alappuzha Town", "Cherthala", "Kayamkulam", "Mavelikkara"],
    hospitals: [
      "Govt TD Medical College, Vandanam",
      "Govt General Hospital, Alappuzha",
      "KVM Hospital, Cherthala",
      "Lifeline Super Speciality Hospital"
    ]
  },
  "Kannur": {
    localities: ["Kannur Town", "Thalassery", "Payyanur", "Taliparamba"],
    hospitals: [
      "Govt Medical College (Pariyaram), Kannur",
      "Aster MIMS Hospital, Chala, Kannur",
      "Koyili Hospital, Pallikkunnu",
      "General Hospital, Thalassery"
    ]
  },
  "Pathanamthitta": {
    localities: ["Pathanamthitta Town", "Thiruvalla", "Adoor", "Ranni"],
    hospitals: [
      "Pushpagiri Medical College Hospital, Thiruvalla",
      "Believers Church Medical College Hospital, Thiruvalla",
      "General Hospital, Pathanamthitta",
      "General Hospital, Adoor"
    ]
  },
  "Idukki": {
    localities: ["Thodupuzha", "Munnar", "Kattappana", "Nedumkandam"],
    hospitals: [
      "Govt Medical College, Idukki",
      "St. Mary's Hospital, Thodupuzha",
      "Holy Family Hospital, Muthalakodam",
      "District Hospital, Painavu"
    ]
  },
  "Wayanad": {
    localities: ["Kalpetta", "Sulthan Bathery", "Mananthavady"],
    hospitals: [
      "Govt Medical College Hospital, Mananthavady",
      "DM WIMS (Aster), Meppadi",
      "Assumption Hospital, Sulthan Bathery",
      "Leo Hospital, Kalpetta"
    ]
  },
  "Kasaragod": {
    localities: ["Kasaragod Town", "Kanhangad", "Nileshwar", "Uppala"],
    hospitals: [
      "Govt Medical College Hospital, Ukkinadka",
      "District Hospital, Kanhangad",
      "Carewell Hospital, Kasaragod",
      "Malik Deenar Hospital, Thalangara"
    ]
  }
};

/**
 * Helper to populate cascading dropdowns
 */
function initKeralaDropdowns(districtSelectId, localitySelectId, hospitalSelectId) {
  const districtSelect = document.getElementById(districtSelectId);
  const localitySelect = document.getElementById(localitySelectId);
  const hospitalSelect = hospitalSelectId ? document.getElementById(hospitalSelectId) : null;

  if (!districtSelect) return;

  // Clear & populate districts
  districtSelect.innerHTML = '<option value="" disabled selected>Select District</option>';
  Object.keys(KERALA_DATA).sort().forEach(district => {
    const opt = document.createElement('option');
    opt.value = district;
    opt.textContent = district;
    districtSelect.appendChild(opt);
  });

  districtSelect.addEventListener('change', () => {
    const selectedDistrict = districtSelect.value;
    const data = KERALA_DATA[selectedDistrict];

    if (localitySelect) {
      localitySelect.innerHTML = '<option value="" disabled selected>Select Locality</option>';
      if (data && data.localities) {
        data.localities.forEach(loc => {
          const opt = document.createElement('option');
          opt.value = loc;
          opt.textContent = loc;
          localitySelect.appendChild(opt);
        });
        localitySelect.disabled = false;
      } else {
        localitySelect.disabled = true;
      }
    }

    if (hospitalSelect) {
      hospitalSelect.innerHTML = '<option value="" disabled selected>Select Hospital</option>';
      if (data && data.hospitals) {
        data.hospitals.forEach(hosp => {
          const opt = document.createElement('option');
          opt.value = hosp;
          opt.textContent = hosp;
          hospitalSelect.appendChild(opt);
        });
        hospitalSelect.disabled = false;
      } else {
        hospitalSelect.disabled = true;
      }
    }
  });
}
