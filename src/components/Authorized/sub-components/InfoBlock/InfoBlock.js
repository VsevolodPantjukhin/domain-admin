import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import { useNavigate } from "react-router-dom";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Popover from "@mui/material/Popover";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {logOut} from "../../../../rm"

function stringToColor(string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
}

function stringAvatar(name) {
    return {
        sx: {
            bgcolor: stringToColor(name),
        },
        children: `${name.split(' ')[0][0]}`,
    };
}

const InfoBlock = ({ profile, ...props }) => {
    const navigate = useNavigate();
    const [avatarEl, setAvatarEl] = React.useState(null);

    const handleAvatarClick = (e) => {
        setAvatarEl(e.currentTarget);
    };

    const handleAvatarClose = () => {
        setAvatarEl(null);
    };

    const exit = () => {
        logOut()
    }

    const open = Boolean(avatarEl);
    const id = open ? "avatar-popover" : undefined;

    return (
        <div>
            <Stack direction="row" spacing={1}>
                <Button aria-describedby={id} onClick={handleAvatarClick}>
                    <Avatar {...stringAvatar(profile.email)} />
                    <KeyboardArrowDownIcon />
                </Button>
            </Stack>
            <Popover
                id={id}
                open={open}
                anchorEl={avatarEl}
                onClose={handleAvatarClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left"
                }}
            >
                <List disablePadding>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemText secondary={profile.email} />
                        </ListItemButton>
                    </ListItem>
                    {/*
                    <Divider />
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemText primary="Favorites" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemText primary="Setting" />
                        </ListItemButton>
                    </ListItem> */}
                    <Divider />
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemText onClick={exit} primary="Выйти из профиля" />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Popover>

        </div>
    )
}

export default InfoBlock;


