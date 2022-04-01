import HttpError from "http-errors";
import userModel from '../models/usersModel.js'
import bcrypt from 'bcrypt';
import messagesapp from "../data/messages.js";
import messagesusr from "../data/messagesusr.js";

const register = (req, res, next) => {
    console.log(`---> userController::register`);

    try {
        const body = req.body;
        let result;
        console.log(`---> userController::REGISTER ${body.password}`);
        const user = { username: body.username, password: body.password, timestamp: (body.timestamp || 0), active: (body.avtive || 1) };

        result = userModel.getUser(user);
        if (result != undefined) {
            next(HttpError(400, { message: messagesapp.user_error_username }));
        } else {
            result = userModel.createUser(user);
            const publicResult = { username: result.username, timestamp: result.timestamp, grants: result.grants, message: messagesusr.user_msg_create };
            if (result < 0)
                next(HttpError(400, { message: messagesapp.user_error_register }))
            res.status(201).json(publicResult);
        }

    } catch (error) {
        next(error);
    }

};

const login = (req, res, next) => {
    console.log(`---> userController::login`);

    try {
        const body = req.body;
        const user = { username: body.username, password: body.password };
        const result = userModel.getUser(user);
        const publicResult = { username: result.username, timestamp: result.timestamp, grants: result.grants, notices: result.notices, message: messagesusr.user_msg_login };
        if (result === undefined) {
            next(HttpError(400, { message: messagesapp.user_error_username }));
        } else {
            console.log(`---> userController::login ${result.password}`);
            console.log(`---> userController::login ${body.password}`);

            if (!result.active) {
                next(HttpError(400, { message: messagesapp.user_error_active }));
            } else {
                if (!bcrypt.compareSync(body.password, result.password))
                    next(HttpError(400, { message: messagesapp.user_error_login }));
                else
                    res.status(200).json(publicResult);
            }

        }

    } catch (error) {
        next(error);
    }
};

const updatePassword = (req, res, next) => {
    console.log(`---> userController::updatePassword`);

    try {
        const body = req.body;
        const user = { username: body.username, password: body.password, newpassword: body.newpassword };
        const result = userModel.getUser(user);

        if (result === undefined) {
            next(HttpError(400, { message: messagesapp.user_error_username }));
        } else {

            if (!bcrypt.compareSync(body.password, result.password))
                next(HttpError(400, { message: messagesapp.user_error_login }));
            else {
                const result_new = userModel.updatePassword(user);
                const publicResult = { username: result_new.username, timestamp: result_new.timestamp, grants: result_new.grants, message: messagesusr.user_msg_newpassw };
                res.status(200).json(publicResult);
            }

        }

    } catch (error) {
        next(error);
    }
};


const addGrantPrivileges = (req, res, next) => {
    console.log(`---> userController::addGrantPrivileges`);

    try {
        const body = req.body;
        const user = { username: body.username, grants: body.grants };
        const result = userModel.getUser(user);

        if (result === undefined) {
            next(HttpError(400, { message: messagesapp.user_error_username }));
        } else {
            const result_new = userModel.addGrantPrivileges(user);
            const publicResult = { username: result_new.username, timestamp: result_new.timestamp, grants: result_new.grants, message: messagesusr.user_msg_addgrants };
            res.status(200).json(publicResult);
        }
    } catch (error) {
        next(error);
    }
};


const insertGrantPrivileges = (req, res, next) => {
    console.log(`---> userController::insertGrantPrivileges`);

    try {
        const body = req.body;
        const user = { username: body.username, grants: body.grants };
        const result = userModel.getUser(user);

        if (result === undefined) {
            next(HttpError(400, { message: messagesapp.user_error_username }));
        } else {

            const result_new = userModel.insertGrantPrivileges(user);
            const publicResult = { username: result_new.username, timestamp: result_new.timestamp, grants: result_new.grants, message: messagesusr.user_msg_insertgrants };
            res.status(200).json(publicResult);
        }
    } catch (error) {
        next(error);
    }
};



const deleteGrantPrivileges = (req, res, next) => {
    console.log(`---> userController::deleteGrantPrivileges`);

    try {
        const body = req.body;
        const user = { username: body.username, grants: body.grants };
        const result = userModel.getUser(user);

        if (result === undefined) {
            next(HttpError(400, { message: messagesapp.user_error_username }));
        } else {
            const result_new = userModel.deleteGrantPrivileges(user);
            const publicResult = { username: result_new.username, timestamp: result_new.timestamp, grants: result_new.grants, message: messagesusr.user_msg_deletegrants };
            res.status(200).json(publicResult);
        }
    } catch (error) {
        next(error);
    }
};

const getUser = (req, res, next) => {
    console.log(`---> userController::getUser`);

    try {
        console.log(req.params.user)
        const user = req.params.user;
        const result = userModel.getUser({ username: user });

        if (result === undefined) {
            next(HttpError(400, { message: messagesapp.user_error_username }));
        } else {
            const _result = JSON.parse(JSON.stringify(result));
            delete _result.password;
            const publicResult = { username: _result.username, timestamp: _result.timestamp, grants: _result.grants, message: messagesusr.user_msg_getusr };
            res.status(200).json(publicResult);
        }
    } catch (error) {
        next(error);
    }
};

const deleteUser = (req, res, next) => {
    console.log(`---> userController::dropUser`);

    try {
        const body = req.body;
        const user = { username: body.username };
        const result = userModel.getUser(user);


        if (result === undefined) {
            next(HttpError(400, { message: messagesapp.user_error_username }));
        } else {
            const result_new = userModel.dropUser(user);
            const publicResult = { username: result_new.username, timestamp: result_new.timestamp, grants: result_new.grants, message: messagesusr.user_msg_deactivateuser };
            res.status(200).json(publicResult);
        }
    } catch (error) {
        next(error);
    }
};


const activeUser = (req, res, next) => {
    console.log(`---> userController::activeUser`);

    try {
        //req=llegan los parametros que entramos enviamos
        //y los metemos en un json básico
        const body = req.body;
        const user = { username: body.username };
        //aqui obtenemos el usuario con el que queremos trabajar
        const result = userModel.getUser(user);
        //si el usuario no existe
        if (result === undefined) {
            next(HttpError(400, { message: messagesapp.user_error_username }));
            //sino utilizamos el usuario que obtenemos en el req
        } else {
            const result_new = userModel.raiseUser(user);
            const publicResult = { username: result_new.username, timestamp: result_new.timestamp, grants: result_new.grants, message: messagesusr.user_msg_activateuser };
            res.status(200).json(publicResult);
        }
    } catch (error) {
        next(error);
    }
};


const addProfileData = (req, res, next) => {
    console.log(`---> addProfileData::insertProfileData`);

    try {
        const body = req.body;
        const user = { username: body.username, profiledata: body.profiledata };
        const result = userModel.getUser(user);

        if (result === undefined) {
            next(HttpError(400, { message: messagesapp.user_error_username }));
        } else {

            const result_new = userModel.addProfile(user);
            const publicResult = { username: result_new.username, timestamp: result_new.timestamp, grants: result_new.grants, profiledata: result_new.profiledata, message: messagesusr.user_msg_addprofiledata };
            res.status(200).json(publicResult);
        }
    } catch (error) {
        next(error);
    }
};





const getFullUser = (req, res, next) => {
    console.log(`---> userController::login`);

    try {
        const body = req.body;
        const user = { username: body.username};
        const result = userModel.getFullUser(user);
        const publicResult = { username: result.username, password: result.password, timestamp: result.timestamp, active:result.active, grants: result.grants, profiledata: result.profiledata, notices: result.notices, message: "GETFULL"};
        if (result === undefined) {
            next(HttpError(400, { message: messagesapp.user_error_username }));
        } else {
            console.log(`---> userController::login ${result.password}`);
            console.log(`---> userController::login ${body.password}`);

            if (!result.active) {
                next(HttpError(400, { message: messagesapp.user_error_active }));
            } else {
                if (!bcrypt.compareSync(body.password, result.password))
                    next(HttpError(400, { message: messagesapp.user_error_login }));
                else
                    res.status(200).json(publicResult);
            }

        }

    } catch (error) {
        next(error);
    }
};



export default {
    register,
    login,
    updatePassword,
    addGrantPrivileges,
    deleteGrantPrivileges,
    insertGrantPrivileges,
    getUser,
    deleteUser,
    activeUser,
    addProfileData,
    getFullUser
}