// Accounts object
function Accounts({
  savingsStart = 15000,
  savingsInterest = 0.07,
  savingsPayments = 0,
  rentPayments = 0,
  rentGrowth = 0,
  mortgageStart = 0,
  mortgageInterest = 0.025,
  mortgagePayments = 0,
  houseValue = 0,
  houseGrowth = 0.03
} = {}) {
  // set up default values
  this.savingsStart = savingsStart
  this.savingsInterest = savingsInterest
  this.savingsPayments = savingsPayments
  this.rentPayments = rentPayments
  this.rentGrowth = rentGrowth
  this.mortgageStart = mortgageStart
  this.mortgageInterest = mortgageInterest
  this.mortgagePayments = mortgagePayments
  this.houseValue = houseValue
  this.houseGrowth = houseGrowth
  this.savings = savingsStart
  this.savings_paid = 0
  this.mortgage = mortgageStart
  this.mortgagePaid = 0

  // set up the object methods
  this.step = function () {
    // Step a single year
    oneOffSavings = 0

    // Step 1 month at a time, as savings often compound monthly
    for (i = 0; i < 12; i++) {
      ///// MORTGAGE
      // Calculate mortage interest
      mInterest = this.mortgage * (this.mortgageInterest / 12);
      this.mortgage += mInterest

      // Subtract payments
      this.mortgage -= this.mortgagePayments
      this.mortgagePaid += this.mortgagePayments

      // The month the mortgage is paid off, put everything into savings
      if ((this.mortgage <= 0) & (this.mortgagePayments != 0)) {
        oneOffSavings = -this.mortgage
        this.savingsPayments += this.mortgagePayments
        this.mortgagePayments = 0
        this.mortgage = 0
      }

      /// SAVINGS
      // Add savings interest
      sInterest = this.savings * (this.savingsInterest / 12)
      this.savings += sInterest
      // Monthly contribution + leftovers in case mortgage was paid
      this.savings += this.savingsPayments + oneOffSavings
      this.savings_paid += this.savingsPayments + oneOffSavings
      oneOffSavings = 0
    }

    // Update house price (annually, it doesn't compound)
    houseValueAccrued = this.houseValue * this.houseGrowth
    this.houseValue += houseValueAccrued

    // Update total assets
    this.updateTotalAssets()
  }

  this.updateTotalAssets = function () {
    totalAssets = 0

    if (this.mortgagePaid > 0) {
      houseFractionOwned =
        1 - this.mortgage / (this.mortgage + this.mortgagePaid)
      this.housePercentOwned = houseFractionOwned * 100

      totalAssets += houseFractionOwned * this.houseValue
    }

    totalAssets += this.savings - this.mortgage
    this.totalAssets = totalAssets
  }

  // function multplying inputs by years
  this.step_n_years = function (years) {
    for (year = 0; year < years; year++) {
      console.log(year, this.savings, this.savingsPayments, this.mortgage)
      this.step()
    }
  }
  // function to return results in console
  this.prettyPrint = function () {
    const toPrint = ['mortgage', 'savings', 'totalAssets']

    console.log('*'.repeat(70))
    for (let k of toPrint) {
      // Format v
      let v = this[k]
      console.log(k, v)
      v = v.toFixed(2).toLocaleString()
      v = v.toString().padStart(20, ' ')

      // Format k
      k = k.padEnd(50, ' ')
      let info = `${k}${v}`
      console.log(info)
    }
  }

  //
  this.populateRentResults = function () {
    rentSavingsResult.innerHTML = this.savings.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })
    rentAssetsResult.innerHTML = this.totalAssets.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })

  }
  this.populateBuyResults = function () {
    mortgageResult.innerHTML = this.mortgage.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })
    ownerSavingsResult.innerHTML = this.savings.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })
    ownerTotalAssetsResult.innerHTML = this.totalAssets.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })
  }
}


function test() {
  // Check results match python with some sensible parameters
  let years = 0
  let initialInvestment = 20000
  let houseValue = 400000
  let mortgageStart = houseValue - initialInvestment


  // let rentPayments = 1300
  // let monthlyPayments = savingsPayments

  // Rent type account
  let rentAccount = new Accounts({
    savingsPayments: 0,
    rentPayments: 1300,
    savingsStart: initialInvestment
  })

  // Mortgage type account
  let buyAccount = new Accounts({
    savingsPayments: 2000,
    mortgagePayments: 2000,
    mortgageStart: mortgageStart,
    houseValue: houseValue
  })

  buyAccount.step_n_years(years)
  buyAccount.prettyPrint()

  rentAccount.step_n_years(years)
  rentAccount.prettyPrint()
}

// test()

function runNumbers() {
  //COMMON VALUES
  let availableIncome = +document.getElementById('availableIncome').value
  let years = +document.getElementById('years').value
  let savingsStart = +document.getElementById('savingsStart').value
  let mortgageInterest = +document.getElementById('mortgageInterest').value
  let savingsInterest = +document.getElementById('savingsInterest').value

  // sets up a new account for home-owners, taking figures from UI.
  let houseValue = +document.getElementById('houseValue').value
  let mortgageStart = (houseValue - savingsStart)
  let mortgagePayments = +document.getElementById('mortgagePayments').value

  let buyAccount = new Accounts({
    savingsPayments: availableIncome - mortgagePayments,
    mortgagePayments: mortgagePayments,
    savingsStart: 0,
    houseValue: houseValue,
    mortgageStart: mortgageStart,
    mortgageInterest: mortgageInterest,
    savingsInterest: savingsInterest
  })
  // runs through results from buyAccount, runs step_n_years() where n = UI then populates results based on output from step_n_years()
  buyAccount.step_n_years(years)
  buyAccount.populateBuyResults()

  // sets up new account for renters, runs step_n_years() where n = UI then populates results based on output from step_n_years()
  let rentPayments = +document.getElementById('rentPayments').value

  let rentAccount = new Accounts({
    savingsPayments: availableIncome - rentPayments,
    savingsStart: savingsStart,
    rentPayments: rentPayments,
    savingsInterest: savingsInterest
  })

  rentAccount.step_n_years(years)
  rentAccount.populateRentResults()
}

//rent numbers following calc_net_assets in buy_vs_rent.py line 96


// runNumbers()

// function rentNumbers() {
//   //COMMON VALUES
//   let years = +document.getElementById('years').value
//   let rentPayments = +document.getElementById('rentPayments').value
//   let savingsStart = +document.getElementById('savingsStart').value
//   let savingsPayments = +document.getElementById('savingsPayments').value
//
//
//   let account = new Accounts({
//     savingsPayments: +document.getElementById('savingsPayments').value,
//     rentPayments: +document.getElementById('rentPayments').value,
//     savingsStart: +document.getElementById('savingsStart').value
//   })
//   // console.log('rentNumbers rentPayments', rentPayments)
//   // console.log('rentNumbers savingsStart', savingsStart)
//   // console.log('rentNumbers savingsPayments', savingsPayments)
//
//   // console.log('rentNumbers account', account)
//   account.step_n_years(years)
//   account.prettyPrint()
//   account.populateResults()
// }
