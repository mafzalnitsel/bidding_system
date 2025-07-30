const customselect = {
    option: (provided, state) => ({
        ...provided,
        height: "auto",
        paddingTop: 0,
        fontSize: " 10px !important",
        // borderBottom: '1px dotted pink',
        // padding: 20,
    }),
    menuPortal: base => ({ ...base, fontSize: " 10px !important" }),
    control: () => ({
        height: "1.6rem",
        width: " 13rem !important",
        cursor: " pointer !important",
        // display: " -webkit-box !important",
        // display: " -webkit-flex !important",
        // display: " -ms-flexbox !important",
        display: " flex !important",
        alignItems: " center !important",
        backgroundColor: " white !important",
        borderRadius: " 4px !important",
        borderStyle: " solid !important",
        borderWidth: " 1px !important",
        borderColor: " rgb(19, 17, 17) !important",
        justifyContent: " space-between !important",
        outline: " 0 !important",
        transition: " all 100ms !important",
        boxSizing: " border-box !important",
    }),
    multiValue: (provided) => ({
        ...provided,
        overflow: 'hidden',
        position: 'relative',
        flex: 1,
        display: 'flex',
        WebkitAlignItems: 'center',
        WebkitBoxAlign: 'center',
        alignItems: 'center',
        borderRadius: '4px',
        height: '22px'
    }),
    singleValue: (provided, state) => ({
        // const opacity = state.isDisabled ? 0.5 : 1;
        // const transition = 'opacity 300ms';
        ...provided,
        top: " 50% !important",
        fontSize: " 10px !important",
    })
}
export default customselect;
