import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Chip, Autocomplete, TextField } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import useDebounce from "../../../../hooks/useDebounce";
import axios from 'axios';
import './DomainModal.css'

const DomainModal = ({ fetchDomains, profile, domainObject, open, setOpen, mode, handleEditClose, ...props }) => {
    const [domain, setDomain] = useState(mode === 'edit' ? domainObject.domain : '');
    const [registrar, setRegistrar] = useState(mode === 'edit' ? domainObject.registrar : '');
    const [dateCreated, setDateCreated] = useState(mode === 'edit' ? dayjs.unix(Math.floor(domainObject.dateCreated / 1000)) : dayjs());
    const [query, setQuery] = useState('');
    const [selectedTags, setSelectedTags] = useState(mode === 'edit' ? domainObject.tags.map(v => ({ label: v.label, id: v.tagId })) : []);
    const [options, setOptions] = useState([]);
    const debouncedQuery = useDebounce(query, 500);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleClose = () => {
        if (mode === 'edit') {
            handleEditClose()
        } else {
            setOpen(false);
        }
    }

    const handleQuery = (e) => {
        const v = e.target.value
        setQuery(v);

    }

    useEffect(() => {
        if (query.trim() !== '') {
            performQuery(query)
        }
    }, [debouncedQuery])

    const performQuery = (v) => {
        let qp = new URLSearchParams();
        qp.append('limit', 10000);
        qp.append('label', v);
        axios.get(window.url + "tags?" + qp.toString()).then(res => {
            if (res.status === 200) {
                let result = res.data.results;
                if (Array.isArray(profile.whitelist) && profile.whitelist.length !== 0) {
                    result = result.filter(t => profile.whitelist.includes(t.id));
                };
                if (profile.blacklist.length !== 0) {
                    result = result.filter(t => !profile.blacklist.includes(t.id));
                }
                setOptions(result)
            } else {
                setOptions([])
            }
        }).catch(err => {
            console.log(err)
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        if (mode === 'edit') {
            axios.patch(window.url + "domains/" + domainObject.id, {
                "domain": domain,
                "dateCreated": dateCreated.unix(),
                "registrar": registrar,
                "tags": selectedTags.map(t => ({ label: t.label, tagId: t.id }))
            }).then(
                res => {
                    if (res.status === 200) {
                        fetchDomains()
                        handleClose();
                    } else {
                        console.log("error")
                    }
                    setIsSubmitting(false);
                }
            ).catch(err => {
                console.log(err);
                setIsSubmitting(false);
            })
        } else {
            axios.post(window.url + "domains", {
                "domain": domain,
                "dateCreated": dateCreated.unix(),
                "registrar": registrar,
                "account": profile.email,
                "tags": selectedTags.map(t => ({ label: t.label, tagId: t.id }))
            }).then(
                res => {
                    if (res.status === 201) {
                        fetchDomains()
                        handleClose();
                    } else {
                        console.log("error")
                    }
                    setIsSubmitting(false);
                }
            ).catch(err => {
                console.log(err);
                setIsSubmitting(false);
            })
        }

    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{mode === 'edit' ? "Редактировать домен" : "Добавить домен"} </DialogTitle>
                <DialogContent>
                    <input value={domain} onChange={(e) => setDomain(e.target.value)} className='domain-input' placeholder='Укажите домен'></input>
                    <input value={registrar} onChange={(e) => setRegistrar(e.target.value)} className='domain-input-sub' placeholder='Укажите регистратора'></input>
                    <DatePicker value={dateCreated}
                        format="DD/MM/YYYY"
                        onChange={(newValue) => setDateCreated(newValue)}
                        className="datePickerMargin"
                        label="Дата создания"
                    />


                    <Autocomplete
                        multiple
                        id="tags-standard"
                        options={options}
                        getOptionLabel={(option) => option.label}
                        value={selectedTags}
                        onChange={(e, v) => setSelectedTags(v)}
                        className='AutocompleteMargin'
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                value={query}
                                onChange={handleQuery}
                                variant="standard"
                                label=""
                                placeholder="Тематика"
                            />
                        )}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Отмена</Button>
                    <Button
                        disabled={isSubmitting}
                        onClick={handleSubmit}
                    >{mode === 'edit' ? "Редактировать" : "Добавить"}</Button>
                </DialogActions>
            </Dialog>
        </LocalizationProvider>
    )

}

export default DomainModal;