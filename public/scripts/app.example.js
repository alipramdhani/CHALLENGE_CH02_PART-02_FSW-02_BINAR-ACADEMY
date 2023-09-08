class App {
  constructor() {
    this.clearButton = document.getElementById("clear-btn");
    this.loadButton = document.getElementById("load-btn");
    this.carContainerElement = document.getElementById("cars-container");
    this.tipeDriver = document.getElementById("tipeDriver")
    this.tanggal = document.getElementById("tanggal")
    this.waktuJemput = document.getElementById("waktuJemput")
    this.jumlahPenumpang = document.getElementById("jumlahPenumpang")
  }

  async init() {
    await this.load();
    this.run()
  }

  run = () => {
    Car.list.forEach((car) => {
      const node = document.createElement("div");
      node.classList.add("col-lg-4", "my-2");
      node.innerHTML = car.render();
      this.carContainerElement.appendChild(node);
    });
  };

  async load() {
    const cars = await Binar.listCars();
    Car.init(cars);
    console.log(cars)
  }

  async loadFilter() {
    // Mengambil data mobil (cars) dengan menggunakan metode asynchronous
    const cars = await Binar.listCars((data) => {
      // Mengkonversi tanggal jemput data dan tanggal yang dipilih menjadi timestamp
        const tanggalJemputData = new Date(data.availableAt).getTime()
        const tanggal = new Date(`${this.tanggal.value} ${this.waktuJemput.value}`).getTime()
        // Memeriksa apakah waktu jemput data tersedia setelah atau pada waktu yang dipilih
        const checkWaktu = tanggalJemputData >= tanggal
        // Mengecek ketersediaan mobil berdasarkan tipe driver yang dipilih
        const availableAt = (this.tipeDriver.value === 'true' && data.available ? true : false)
        // Pengkondisian untuk memfilter mobil berdasarkan berbagai kriteria
        const notAvailableAt = (this.tipeDriver.value === 'false' && !data.available ? true : false) 
        const penumpang = data.capacity >= this.jumlahPenumpang.value
        if (this.tipeDriver.value !== 'default' && this.tanggal.value !== '' && this.waktuJemput.value !== 'false' && this.jumlahPenumpang.value >= 0) {
            return (availableAt || notAvailableAt) && checkWaktu && penumpang
        } else if (this.tipeDriver.value !== 'default' && this.jumlahPenumpang.value > 0) {
            return (availableAt || notAvailableAt) && penumpang
        } else if (this.tanggal.value !== '' && this.waktuJemput.value !== 'false' && this.jumlahPenumpang.value > 0) {
            return checkWaktu && penumpang
        } else if (this.tanggal.value !== '' && this.waktuJemput.value !== 'false') {
            return checkWaktu
        } else if (this.tipeDriver.value !== 'default') {
            return (availableAt || notAvailableAt)
        } else {
            return penumpang
        }

    });
    // Mencetak data mobil yang telah difilter ke konsol
    console.log(cars)
    // Menginisialisasi objek mobil (Car) dengan data yang telah difilter
    Car.init(cars);
}

  clear = () => {
    let child = this.carContainerElement.firstElementChild;

    while (child) {
      child.remove();
      child = this.carContainerElement.firstElementChild;
    }
  };
}
