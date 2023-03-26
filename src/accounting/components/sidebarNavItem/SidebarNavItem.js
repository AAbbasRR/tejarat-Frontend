import React from 'react';

import classes from './styles/SidebarNavItem.module.scss';

import ListItem from '@mui/material/ListItem';
import Button from '@mui/material/Button';
import Badge from '@mui/material/Badge';

import { Link, useLocation } from 'react-router-dom';

const SidebarNavItem = ({ title, icon, link, badge }) => {
    let router = useLocation();

    let active = router.pathname.includes(link);

    return (
        <ListItem className={classes.fullWidth}>
            <Link to={link} className={classes.fullWidth}>
                <Button
                    component="span"
                    startIcon={icon}
                    className={`link ${classes.buttonItem} ${active && classes.activeItem}`}
                    disableRipple
                >
                    {badge ?
                        <Badge color="primary" badgeContent={badge} anchorOrigin={{ vertical: 'top', horizontal: 'left' }}>
                            {title}
                        </Badge>
                        :
                        title
                    }
                </Button>
            </Link>
        </ListItem>
    );
};

export default SidebarNavItem