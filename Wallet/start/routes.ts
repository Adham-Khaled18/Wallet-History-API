/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'


Route.post('/signup','UsersController.signup')
Route.post('/login','UsersController.login')
Route.get('/confirm-email/:email','UsersController.verify').as('verifyEmail')

Route.group(()=>{
    Route.post('/add','TransactionsController.addTransaction')
    Route.put('/update/:id','TransactionsController.updateTransaction')
    Route.delete('/delete/:id','TransactionsController.deleteTransaction')
    Route.get('/view','TransactionsController.view')
    Route.get('/view/:id','TransactionsController.viewTime')
    Route.post('/view/analytic','TransactionsController.analytic')

    Route.post('/wallet/create','WalletsController.create')
    Route.get('/wallet/view','WalletsController.view')
    Route.get('/wallet/view/:id','WalletsController.view')

    
}).middleware('auth')