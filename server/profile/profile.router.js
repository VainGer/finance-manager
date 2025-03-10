import Router from "express";
import {
    addCat, removeCat, renameCat, addItemToCat,
    addTransact, removeItem, renameItem, deleteTransact,
    editTransactionPrice, setPrivacy,
    removeCatSaveItems, moveItem,
    getProfExpenses, getAccautExpenses,
    getCats, getItems, editTransDate, setProfBudg,
    setCatBudg, getProfBudg, getCatBudg,
    getCatsByDates, getCat, getCatDate
} from "./profile.controller.js";



const profileRouter = Router();

profileRouter
    .post('/add_cat', addCat)
    .post('/rem_cat_items', removeCat)
    .post('/rem_cat', removeCatSaveItems)
    .post('/rename_cat', renameCat)
    .post('/add_item', addItemToCat)
    .post('/rename_item', renameItem)
    .post('/remove_item', removeItem)
    .post('/move_item', moveItem)
    .post('/add_transact', addTransact)
    .post('/edit_price', editTransactionPrice)
    .post('/edit_date', editTransDate)
    .post('/delete_spend', deleteTransact)
    .post('/set_privacy', setPrivacy)
    .post('/profile_expenses', getProfExpenses)
    .post('/acc_expenses', getAccautExpenses)
    .post('/categories_list', getCats)
    .post('/get_items', getItems)
    .post('/set_prof_budget', setProfBudg)
    .post('/set_cat_budget', setCatBudg)
    .post('/get_prof_budget', getProfBudg)
    .post('/get_cat_budget', getCatBudg)
    .post('/get_cats_dates', getCatsByDates)
    .post('/get_cat', getCat)
    .post('/get_cat_date', getCatDate)
export default profileRouter;
