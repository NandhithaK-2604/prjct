import styles from './Course.module.css'
const Course1="God"
function Course(){
    return(
        <div className={styles.card}>
            <img src="" alt="" />
            <h3>{Course1}</h3>
            <p>This is code.io html course</p>
        </div>

    );
}
export default Course