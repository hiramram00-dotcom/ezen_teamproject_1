import styles from './HistorySection.module.css'

import history1962 from './assets/history-1962.webp'
import history1987 from './assets/history-1987.webp'
import history2013 from './assets/history-2013.webp'
import history2022 from './assets/history-2022.webp'
import history2023 from './assets/history-2023.webp'

const historyItems = [
  {
    year: '1962',
    title: '일광전구 설립',
    description: (
      <>
        김만중 회장님께서 일광전구를 설립하시고,
        <br />
        백열전구 생산을 시작하였습니다.
      </>
    ),
    image: history1962,
    side: 'left',
  },
  {
    year: '1987',
    title: '미국 수출',
    description: '미국 Walmart에 백열전구를 수출하였습니다.',
    image: history1987,
    side: 'right',
  },
  {
    year: '2013',
    title: '1st 리브랜딩',
    description: (
      <>
        창립 50주년을 맞아
        <br />
        브랜드 리뉴얼을 진행했습니다.
      </>
    ),
    image: history2013,
    side: 'left',
  },
  {
    year: '2022',
    title: '백열전구 생산 종료',
    description: (
      <>
        우리나라 백열전구 제조 역사를 마무리하며,
        <br />
        라이프스타일 조명 브랜드로의 전환을 맞이했습니다.
      </>
    ),
    image: history2022,
    side: 'right',
  },
  {
    year: '2023',
    title: '60주년 브랜드북 발간',
    description: '60년 브랜드의 역사를 담은 브랜드북을 발간하였습니다.',
    image: history2023,
    side: 'left',
  },
]

function HistorySection() {
  return (
    <section className={styles.history} aria-labelledby="history-title">
      <h2 id="history-title" className={styles.heading}>
        <em>our</em> HISTORY
      </h2>

      <div className={styles.timeline}>
        {historyItems.map((item) => (
          <article
            key={item.year}
            className={`${styles.historyItem} ${
              item.side === 'right' ? styles.right : styles.left
            }`}
          >
            <img src={item.image} alt="" />
            <div className={styles.copy}>
              <p className={styles.year}>{item.year}</p>
              <h3>{item.title}</h3>
              <p className={styles.description}>{item.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default HistorySection
