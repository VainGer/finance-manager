import Router from "express";
import {
    addCat, removeCat, renameCat, addItemToCat,
    addTransact, removeItem, renameItem, deleteTransact,
    editTransactionPrice, setPrivacy,
    removeCatSaveItems, moveItem
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
    .post('/delete_spend', deleteTransact)
    .post('/set_privacy', setPrivacy)

export default profileRouter;
