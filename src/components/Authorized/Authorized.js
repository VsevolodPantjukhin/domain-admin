import React, { useState, useEffect } from 'react';
import "./Authorized.css";
import Listing from "../Listing/Listing";
import InfoBlock from "./sub-components/InfoBlock/InfoBlock"
import { Container } from '@mui/material';
import DomainModal from "./sub-components/DomainModal/DomainModal";
import axios from "axios"

const Authorized = () => {
    const [rows, setRows] = useState([]);
    const [domainOpen, setDomainOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [domainObject, setDomainObject] = useState(null);

    // const handleSubmit = () => {
    //     handleListingUpdate();
    //     setOpen(false);
    // }

    // const handleListingUpdate = () => {
    //     setRows([...rows, createData(`${rows.length + 1}`, domain, "1708545373", "1708445373", selectedTags, "name", mail)])
    // }

    const profile = JSON.parse(localStorage.getItem("profile"));


    const sortRows = rs => {
        let result = [].concat(rs);

        if (Array.isArray(profile.whitelist) && profile.whitelist.length !== 0) {
            result = result.filter(v => v.tags.some(tag => profile.whitelist.includes(tag.tagId)))
        };
        if (profile.blacklist.length !== 0) {
            result = result.filter(v => !v.tags.some(tag => profile.blacklist.includes(tag.tagId)))
        }

        return result;
    }

    const fetchDomains = () => {
        axios.get(window.url + "domains?limit=10000").then(res => {
            if (res.status === 200) {
                let domains = res.data.results;
                domains = sortRows(domains)
                setRows(domains)
            }


        }).catch(e => console.log(e))
    }

    useEffect(() => {
        fetchDomains()
    }, [])

    const onDomainClick = dobj => {
        setDomainOpen(true);
        setModalMode("edit");
        setDomainObject(dobj);
    }

    const handleEditClose = () => {
        setDomainOpen(false);
        setModalMode("create");
        setDomainObject(null);
    }

    return (
        <div className="authorized">
            <Container maxWidth="xl">
                <div className="authorized-container">
                    <h1 className="authorized-header">Всего доменов: {rows.length}</h1>
                    <div className='authorized-header-wrapper'>
                        <button className="authorized-header-button-add" onClick={e=>setDomainOpen(true)}>Добавить домен</button>
                        <div>
                            <InfoBlock profile={profile} />
                        </div>
                    </div>
                </div>
            </Container>
            {domainOpen && <DomainModal profile={profile} handleEditClose={handleEditClose} domainObject={domainObject} mode={modalMode} fetchDomains={fetchDomains} open={domainOpen} setOpen={setDomainOpen} />}
            <Listing onDomainClick={onDomainClick} rows={rows} />
        </div>
    );
}

export default Authorized;