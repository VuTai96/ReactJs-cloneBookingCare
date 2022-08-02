import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { LANGUAGES } from '../../../utils';
import * as actions from '../../../store/actions'
import './UserRedux.scss'
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css'; // This only needs to be imported once in your app
import TableManageUser from './TableManageUser'
import { CRUD_STATE } from '../../../utils'


class UserRedux extends Component {
    constructor(props) {
        super(props)
        this.state = {
            arrGender: [],
            arrPosition: [],
            arrRole: [],
            urlImage: '',
            isOpen: false,

            userId: '',
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            address: '',
            gender: '',
            roleId: '',
            positionId: '',
            phonenumber: '',
            image: '',

            crud_state: CRUD_STATE.CREATE
        }
    }

    async componentDidMount() {
        await this.props.fetchGenderStart()
        await this.props.fetchRoleStart()
        await this.props.fetchPositionStart()

    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.genders !== this.props.genders) {
            this.setState({
                arrGender: this.props.genders,
                gender: this.props.genders[0].key
            })
        }
        if (prevProps.roles !== this.props.roles) {
            this.setState({
                arrRole: this.props.roles,
                roleId: this.props.roles[0].key
            })
        }
        if (prevProps.positions !== this.props.positions) {
            this.setState({
                arrPosition: this.props.positions,
                positionId: this.props.positions[0].key
            })
        }
        if (prevProps.listUser !== this.props.listUser) {
            this.setState({
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                address: '',
                gender: this.state.arrGender[0]?.key || '',
                roleId: this.state.arrRole[0]?.key || '',
                positionId: this.state.arrPosition[0]?.key || '',
                phonenumber: '',
                image: '',
                crud_state: CRUD_STATE.CREATE
            })
        }
    }
    handleUploadImage = (e) => {
        let file = e.target.files[0]
        if (file) {
            let urlLink = URL.createObjectURL(file)
            this.setState({
                urlImage: urlLink,
                image: file
            })
        }
    }
    handleOnclickViewImage = () => {
        if (this.state.urlImage) {
            this.setState({
                isOpen: true
            })
        }
    }
    handleOnchangeInput = (e, id) => {
        let coppyState = { ...this.state }
        coppyState[id] = e.target.value
        this.setState({
            ...coppyState
        })
    }
    handleOnclickSubmit = async () => {
        let arrId = ['email', 'password', 'firstName', 'lastName', 'address', 'gender',
            'roleId', 'positionId', 'phonenumber'];
        let image = this.state.urlImage
        let dataUser = {}
        for (const id of arrId) {
            if (!this.state[id]) {
                alert(`Missing ${id}`)
                return;
            }
            dataUser[id] = this.state[id]
        }
        if (this.state.crud_state === CRUD_STATE.EDIT) {
            dataUser.id = this.state.userId
            await this.props.editAUser({ ...dataUser, image })
            await this.props.fetchAllUser()
        } else {
            await this.props.createNewUser({ ...dataUser, image })
            await this.props.fetchAllUser()
        }
    }
    editUserforprops = (user) => {
        console.log(user)
        this.setState({
            userId: user.id,
            email: user.email,
            password: 'HARDCODE',
            firstName: user.firstName,
            lastName: user.lastName,
            address: user.address,
            gender: user.gender,
            roleId: user.roleId,
            positionId: user.positionId,
            phonenumber: user.phonenumber,
            image: user.image,
            crud_state: CRUD_STATE.EDIT
        })
    }

    render() {
        let { arrGender, arrPosition, arrRole, urlImage, isOpen,
            email, password, firstName, lastName, address, gender,
            roleId, positionId, phonenumber, image, crud_state } = this.state
        let { language, isLoadingGender } = this.props;

        return (
            <div className="user-redux-container">
                <div className='title my-3'>
                    <FormattedMessage id="manage-user.add" />
                </div>
                <div className='container'>
                    <div className='col-md-12'>{isLoadingGender ? 'Loading data...' : ''}</div>
                    <form className="row g-3">
                        <div className="col-md-3">
                            <label htmlFor="inputEmail4" className="form-label">
                                <FormattedMessage id="manage-user.email" />
                            </label>
                            <input type="email" className="form-control" id="inputEmail4"
                                value={email}
                                onChange={(e) => this.handleOnchangeInput(e, 'email')}
                                disabled={crud_state === CRUD_STATE.EDIT ? true : false}
                            />
                        </div>
                        <div className="col-md-3">
                            <label htmlFor="inputPassword4" className="form-label">
                                <FormattedMessage id="manage-user.password" />
                            </label>
                            <input type="password" className="form-control" id="inputPassword4"
                                value={password}
                                onChange={(e) => this.handleOnchangeInput(e, 'password')}
                                disabled={crud_state === CRUD_STATE.EDIT ? true : false}
                            />
                        </div>
                        <div className="col-md-3">
                            <label htmlFor="firstName" className="form-label">
                                <FormattedMessage id="manage-user.first-name" />
                            </label>
                            <input type="text" className="form-control" id="firstName"
                                value={firstName}
                                onChange={(e) => this.handleOnchangeInput(e, 'firstName')}
                            />
                        </div>
                        <div className="col-md-3">
                            <label htmlFor="lastName" className="form-label">
                                <FormattedMessage id="manage-user.last-name" />
                            </label>
                            <input type="text" className="form-control" id="lastName"
                                value={lastName}
                                onChange={(e) => this.handleOnchangeInput(e, 'lastName')}
                            />
                        </div>
                        <div className="col-md-3">
                            <label htmlFor="phoneNumber" className="form-label">
                                <FormattedMessage id="manage-user.phone-number" />
                            </label>
                            <input type="text" className="form-control" id="phoneNumber"
                                value={phonenumber}
                                onChange={(e) => this.handleOnchangeInput(e, 'phonenumber')}
                            />
                        </div>
                        <div className="col-md-9">
                            <label htmlFor="inputAddress" className="form-label">
                                <FormattedMessage id="manage-user.address" />
                            </label>
                            <input type="text" className="form-control" id="inputAddress" placeholder="1234 Main St"
                                value={address}
                                onChange={(e) => this.handleOnchangeInput(e, 'address')}
                            />
                        </div>

                        <div className="col-md-3">
                            <label htmlFor="inputGender" className="form-label">
                                <FormattedMessage id="manage-user.gender" />
                            </label>
                            <select id="inputGender" className="form-select"
                                value={gender}
                                onChange={(e) => this.handleOnchangeInput(e, 'gender')}
                            >
                                {
                                    arrGender.map((item, index) => {
                                        return <option key={index} value={item.key}>{language === LANGUAGES.VI ? item.valueVi : item.valueEn}</option>
                                    })
                                }
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label htmlFor="inputPosition" className="form-label">
                                <FormattedMessage id="manage-user.position" />
                            </label>
                            <select id="inputPosition" className="form-select"
                                value={positionId}
                                onChange={(e) => this.handleOnchangeInput(e, 'positionId')}
                            >
                                {
                                    arrPosition.map((item, index) => {
                                        return <option key={index} value={item.key}>{language === LANGUAGES.VI ? item.valueVi : item.valueEn}</option>
                                    })
                                }
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label htmlFor="inputRole" className="form-label">
                                <FormattedMessage id="manage-user.role" />
                            </label>
                            <select id="inputRole" className="form-select"
                                value={roleId}
                                onChange={(e) => this.handleOnchangeInput(e, 'roleId')}
                            >
                                {
                                    arrRole.map((item, index) => {
                                        return <option key={index} value={item.key}>{language === LANGUAGES.VI ? item.valueVi : item.valueEn}</option>
                                    })
                                }
                            </select>
                        </div>
                        <div className="col-md-3">

                            <label htmlFor="inputState" className="form-label">
                                <FormattedMessage id="manage-user.image" />
                            </label>
                            <div className='preview-image-container'>
                                <label htmlFor="inputImage" className="label-upload" >
                                    <FormattedMessage id="manage-user.upload" /><i class="fas fa-upload"></i>
                                </label>
                                <input type="file" className="form-control" id="inputImage" hidden onChange={(e) => this.handleUploadImage(e)} />
                                <div className='preview-image'
                                    onClick={() => this.handleOnclickViewImage()}
                                    style={{
                                        backgroundImage: `url("${urlImage}")`,
                                        backgroundPosition: 'center',
                                        backgroundSize: 'contain',
                                        backgroundRepeat: 'no-repeat'
                                    }}>
                                </div>
                            </div>

                        </div>

                        <div className="col-12">
                            <button type="button"
                                className={crud_state === CRUD_STATE.EDIT ? "btn btn-warning" : "btn btn-primary"}
                                onClick={() => this.handleOnclickSubmit()}
                            >
                                {
                                    crud_state === CRUD_STATE.EDIT ?
                                        <FormattedMessage id="manage-user.saveChange" />
                                        :
                                        <FormattedMessage id="manage-user.save" />
                                }
                            </button>
                        </div>
                    </form>


                    <TableManageUser
                        editUserforprops={this.editUserforprops}
                    />
                </div>

                {
                    isOpen && (
                        <Lightbox
                            mainSrc={urlImage}
                            onCloseRequest={() => this.setState({ isOpen: false })}
                        />
                    )}
            </div>
        )
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genders: state.admin.genders,
        isLoadingGender: state.admin.isLoadingGender,
        roles: state.admin.roles,
        positions: state.admin.positions,
        listUser: state.admin.users
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchGenderStart: () => dispatch(actions.fetchGenderStart()),
        fetchRoleStart: () => dispatch(actions.fetchRoleStart()),
        fetchPositionStart: () => dispatch(actions.fetchPositionStart()),
        createNewUser: (dataUser) => dispatch(actions.createNewUser(dataUser)),
        fetchAllUser: () => dispatch(actions.fetchAllUser()),
        editAUser: (dataUser) => dispatch(actions.editAUser(dataUser))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserRedux);
