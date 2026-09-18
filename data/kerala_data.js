/**
 * VIORA - Kerala Localization Data (All 14 Districts)
 * Complete mapping of Districts -> Localities -> Well-Known Hospitals
 */

const KERALA_DATA = {
  districts: [
    {
      name: "Ernakulam",
      localities: ["Kakkanad", "Edappally", "Aluva", "Fort Kochi", "Kalamassery", "Palarivattom", "Tripunithura", "Angamaly"],
      hospitals: ["Aster Medcity", "Amrita Institute of Medical Sciences", "Lakeshore Hospital", "Lisie Hospital", "Govt. Medical College Kalamassery", "Medical Trust Hospital", "Sunrise Hospital"]
    },
    {
      name: "Thiruvananthapuram",
      localities: ["Pattom", "Kowdiar", "Technopark", "Sreekaryam", "Kazhakkoottam", "Vellayambalam", "Palayam", "Medical College Junction"],
      hospitals: ["Govt. Medical College TVM", "SCTIMST (Sree Chitra)", "KIMS Hospital", "Regional Cancer Centre (RCC)", "Ananthapuri Hospital", "Cosmopolitan Hospital"]
    },
    {
      name: "Kozhikode",
      localities: ["Mananchira", "Beypore", "Koyilandy", "Vatakara", "Mavoor", "Chevayur", "Palayam Kozhikode"],
      hospitals: ["Govt. Medical College Kozhikode", "Baby Memorial Hospital", "Aster MIMS Kozhikode", "Malabar Medical College", "Beach Hospital"]
    },
    {
      name: "Thrissur",
      localities: ["Swaraj Round", "Guruvayur", "Chalakudy", "Kodungallur", "Ollur", "Pudukad", "Kunnamkulam"],
      hospitals: ["Govt. Medical College Thrissur", "Jubilee Mission Medical College", "Amala Institute of Medical Sciences", "Sun Medical Centre", "General Hospital Thrissur"]
    },
    {
      name: "Kottayam",
      localities: ["Kottayam Town", "Changanassery", "Pala", "Ettumanoor", "Kanjirappally", "Vaikom"],
      hospitals: ["Govt. Medical College Kottayam", "Caritas Hospital", "Bharat Hospital", "Mar Sleeva Medicity Pala", "District Hospital Kottayam"]
    },
    {
      name: "Kollam",
      localities: ["Chinnakada", "Kadappakada", "Karunagappally", "Kottarakkara", "Paravur", "Kundara"],
      hospitals: ["Govt. District Hospital Kollam", "Upasana Hospital", "Holy Cross Hospital", "Bishop Benziger Hospital", "Govt. Medical College Parippally"]
    },
    {
      name: "Pathanamthitta",
      localities: ["Thiruvalla", "Adoor", "Pathanamthitta Town", "Ranni", "Pandalam", "Kozhencherry"],
      hospitals: ["Believers Church Medical College Hospital", "General Hospital Pathanamthitta", "Pushpagiri Medical College", "Muthoot Hospital Kozhencherry"]
    },
    {
      name: "Alappuzha",
      localities: ["Alappuzha Town", "Cherthala", "Mavelikkara", "Kayamkulam", "Haripad", "Ambalapuzha"],
      hospitals: ["Govt. Medical College Alappuzha (Vandanam)", "TD Medical College", "General Hospital Alappuzha", "KVM Hospital Cherthala"]
    },
    {
      name: "Idukki",
      localities: ["Painavu", "Thodupuzha", "Munnar", "Adimali", "Kattappana", "Nedumkandam"],
      hospitals: ["Govt. Medical College Idukki (Painavu)", "General Hospital Thodupuzha", "St. Johns Hospital Kattappana", "Holy Family Hospital Thodupuzha"]
    },
    {
      name: "Palakkad",
      localities: ["Palakkad Town", "Ottapalam", "Shoranur", "Chittur", "Mannarkkad", "Alathur"],
      hospitals: ["Govt. Medical College Palakkad", "District Hospital Palakkad", "Lakshmi Hospital", "Valluvanad Hospital Ottapalam", "PK DAS Institute"]
    },
    {
      name: "Malappuram",
      localities: ["Manjeri", "Kottakkal", "Perinthalmanna", "Tirur", "Malappuram Town", "Nilambur"],
      hospitals: ["Govt. Medical College Manjeri", "MIMS Kottakkal", "Al Shifa Hospital Perinthalmanna", "MES Medical College Perinthalmanna", "Moulana Hospital"]
    },
    {
      name: "Wayanad",
      localities: ["Kalpetta", "Sulthan Bathery", "Mananthavady", "Meppadi", "Vythiri"],
      hospitals: ["Govt. District Hospital Mananthavady", "DM WIMS Medical College Meppadi", "General Hospital Kalpetta", "Vinayaka Hospital Sulthan Bathery"]
    },
    {
      name: "Kannur",
      localities: ["Kannur Town", "Thalassery", "Payyanur", "Mattannur", "Taliparamba", "Iritty"],
      hospitals: ["Govt. Medical College Pariyaram", "District Hospital Kannur", "Malabar Cancer Centre Thalassery", "Koyili Hospital", "AKG Memorial Hospital"]
    },
    {
      name: "Kasaragod",
      localities: ["Kasaragod Town", "Kanhangad", "Uppala", "Nileshwar", "Cheruvathur"],
      hospitals: ["Govt. Medical College Kasaragod", "General Hospital Kasaragod", "District Hospital Kanhangad", "Carewell Hospital"]
    }
  ],

  bloodGroups: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],

  initialSeedDonors: [
    // Ernakulam
    {
      id: "donor-ekm-01",
      name: "Rahul Menon",
      phone: "+919847123450",
      phone_verified: true,
      blood_group: "O-",
      locality: "Kakkanad",
      district: "Ernakulam",
      last_donation_date: new Date(Date.now() - 112 * 86400000).toISOString().split('T')[0],
      available: true,
      trust_score: 94,
      distanceKm: 2.1
    },
    {
      id: "donor-ekm-02",
      name: "Anjali Nair",
      phone: "+919847123451",
      phone_verified: true,
      blood_group: "O-",
      locality: "Edappally",
      district: "Ernakulam",
      last_donation_date: new Date(Date.now() - 95 * 86400000).toISOString().split('T')[0],
      available: true,
      trust_score: 88,
      distanceKm: 4.8
    },
    {
      id: "donor-ekm-03",
      name: "Fahad Kabeer",
      phone: "+919847123452",
      phone_verified: true,
      blood_group: "O-",
      locality: "Kakkanad",
      district: "Ernakulam",
      last_donation_date: null,
      available: true,
      trust_score: 75,
      distanceKm: 1.5
    },
    {
      id: "donor-ekm-04",
      name: "Gopika Krishnan",
      phone: "+919847123453",
      phone_verified: true,
      blood_group: "A+",
      locality: "Aluva",
      district: "Ernakulam",
      last_donation_date: new Date(Date.now() - 120 * 86400000).toISOString().split('T')[0],
      available: true,
      trust_score: 92,
      distanceKm: 7.2
    },
    {
      id: "donor-ekm-05",
      name: "Mathew Thomas",
      phone: "+919847123454",
      phone_verified: true,
      blood_group: "B+",
      locality: "Kalamassery",
      district: "Ernakulam",
      last_donation_date: new Date(Date.now() - 40 * 86400000).toISOString().split('T')[0],
      available: false,
      trust_score: 85,
      distanceKm: 5.1
    },
    {
      id: "donor-ekm-06",
      name: "Sneha Paul",
      phone: "+919847123455",
      phone_verified: true,
      blood_group: "O+",
      locality: "Fort Kochi",
      district: "Ernakulam",
      last_donation_date: new Date(Date.now() - 100 * 86400000).toISOString().split('T')[0],
      available: true,
      trust_score: 90,
      distanceKm: 8.4
    },
    // Thiruvananthapuram
    {
      id: "donor-tvm-01",
      name: "Adarsh Varma",
      phone: "+919847123456",
      phone_verified: true,
      blood_group: "O-",
      locality: "Pattom",
      district: "Thiruvananthapuram",
      last_donation_date: new Date(Date.now() - 140 * 86400000).toISOString().split('T')[0],
      available: true,
      trust_score: 96,
      distanceKm: 3.0
    },
    {
      id: "donor-tvm-02",
      name: "Devika Suresh",
      phone: "+919847123457",
      phone_verified: true,
      blood_group: "O-",
      locality: "Kowdiar",
      district: "Thiruvananthapuram",
      last_donation_date: new Date(Date.now() - 105 * 86400000).toISOString().split('T')[0],
      available: true,
      trust_score: 89,
      distanceKm: 4.2
    },
    {
      id: "donor-tvm-03",
      name: "Vishnu Namboothiri",
      phone: "+919847123458",
      phone_verified: true,
      blood_group: "A-",
      locality: "Technopark",
      district: "Thiruvananthapuram",
      last_donation_date: new Date(Date.now() - 98 * 86400000).toISOString().split('T')[0],
      available: true,
      trust_score: 82,
      distanceKm: 6.5
    },
    {
      id: "donor-tvm-04",
      name: "Arun Kumar",
      phone: "+919847123459",
      phone_verified: true,
      blood_group: "AB+",
      locality: "Sreekaryam",
      district: "Thiruvananthapuram",
      last_donation_date: null,
      available: true,
      trust_score: 70,
      distanceKm: 5.8
    },
    // Kozhikode
    {
      id: "donor-clt-01",
      name: "Mohammed Nihal",
      phone: "+919847123460",
      phone_verified: true,
      blood_group: "O-",
      locality: "Mananchira",
      district: "Kozhikode",
      last_donation_date: new Date(Date.now() - 130 * 86400000).toISOString().split('T')[0],
      available: true,
      trust_score: 95,
      distanceKm: 2.5
    },
    {
      id: "donor-clt-02",
      name: "Aswathi Raj",
      phone: "+919847123461",
      phone_verified: true,
      blood_group: "B+",
      locality: "Beypore",
      district: "Kozhikode",
      last_donation_date: new Date(Date.now() - 150 * 86400000).toISOString().split('T')[0],
      available: true,
      trust_score: 91,
      distanceKm: 6.1
    },
    {
      id: "donor-clt-03",
      name: "Shyam Sundar",
      phone: "+919847123462",
      phone_verified: true,
      blood_group: "O+",
      locality: "Koyilandy",
      district: "Kozhikode",
      last_donation_date: new Date(Date.now() - 91 * 86400000).toISOString().split('T')[0],
      available: true,
      trust_score: 84,
      distanceKm: 12.0
    },
    // Thrissur
    {
      id: "donor-tsr-01",
      name: "Tony Joseph",
      phone: "+919847123463",
      phone_verified: true,
      blood_group: "O-",
      locality: "Swaraj Round",
      district: "Thrissur",
      last_donation_date: new Date(Date.now() - 110 * 86400000).toISOString().split('T')[0],
      available: true,
      trust_score: 93,
      distanceKm: 1.8
    },
    {
      id: "donor-tsr-02",
      name: "Haritha Pillai",
      phone: "+919847123464",
      phone_verified: true,
      blood_group: "A+",
      locality: "Guruvayur",
      district: "Thrissur",
      last_donation_date: new Date(Date.now() - 102 * 86400000).toISOString().split('T')[0],
      available: true,
      trust_score: 87,
      distanceKm: 14.5
    },
    // Kottayam
    {
      id: "donor-ktm-01",
      name: "Roshni George",
      phone: "+919847123465",
      phone_verified: true,
      blood_group: "O-",
      locality: "Kottayam Town",
      district: "Kottayam",
      last_donation_date: new Date(Date.now() - 160 * 86400000).toISOString().split('T')[0],
      available: true,
      trust_score: 97,
      distanceKm: 2.2
    },
    {
      id: "donor-ktm-02",
      name: "Jithin Varghese",
      phone: "+919847123466",
      phone_verified: true,
      blood_group: "AB-",
      locality: "Changanassery",
      district: "Kottayam",
      last_donation_date: new Date(Date.now() - 93 * 86400000).toISOString().split('T')[0],
      available: true,
      trust_score: 80,
      distanceKm: 9.3
    },
    // Palakkad
    {
      id: "donor-pkd-01",
      name: "Sujith Ram",
      phone: "+919847123467",
      phone_verified: true,
      blood_group: "O-",
      locality: "Palakkad Town",
      district: "Palakkad",
      last_donation_date: new Date(Date.now() - 115 * 86400000).toISOString().split('T')[0],
      available: true,
      trust_score: 86,
      distanceKm: 3.4
    }
  ]
};

if (typeof window !== "undefined") {
  window.KERALA_DATA = KERALA_DATA;
}
