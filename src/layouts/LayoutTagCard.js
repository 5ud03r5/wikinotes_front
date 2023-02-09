import classes from './LayoutTagCard.module.css'

const LayoutTagCard = (props) => {
    return <div className={classes.div}>{props.children}</div>
}

export default LayoutTagCard