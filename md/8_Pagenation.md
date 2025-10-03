# Pagination

## Pagination이란?

- 쿼리에 해당하는 모든 데이터를 한번에 불러오지 않고 부분적으로 쪼개서 불러온다.
- 현대 클라우드 시스템은 데이터 전송에 돈이 들기 때문에 효율적인 조회를 통해 비용을 절감 해야한다.
- 또한 한번에 많은 데이터를 불러오게 되면 서버에 부하(주로 메모리)가 걸릴 수 있기 때문에, 적절한 크기로 쪼개서 불러오는 것이 좋다.
- 데이터가 많기 때문에 데이터 전송하는데 걸리는 시간이 길어질 수 있다.

## Pagenation 이론

### Page Based Pagination

- 페이지 기준으로 데이터를 잘러서 요청하는 방식
- 요청을 보낼때 원하는 데이터 갯수와 몇번째 페이지를 가져올지 명시
- 페이지 숫자를 누르면 다음 페이지로 넘어가는 형태의 UI에서 많이 사용
- pagenation 도중 데이터베이스에서 데이터가 추가되거나 삭제될 경우 저장되는 데이터가 누락거나 중복될 수 있음
- pageination 알고리즘이 매우 간단

### Cursor Based Pagination

- 가장 최근에 가져온 데이터를 기준으로 다음 데이터를 가지고오는 방식
- 요청을 보낼 때 마지막 데이터의 기준값(ID Unique)과 몇개의 데이터를 가져올지 명시
- 스크롤 형태의 리스트에서 자주 사용
- 최근 데이터의 기준값을 기반으로 쿼리가 작성되기 때문에 데이터가 누락되거나 중복될 가능성이 적음

### 요청 형태

- {property}\_\_{filter} 형식으로 구현
- ex: http://localhost:3000/posts?order**createdAt=ASC&Where**id_more_then=3&take=20
  - order\_\_createdAt=ASC : createdAt 속성을 기준으로 오름차순 정렬
  - Where\_\_id_more_then=3 : id가 3보다 큰 데이터만 조회
  - take=20 : 20개의 데이터만 조회

### 응답 형태

```JSON
{
  // 데이터를 리스트로 받는 부분
  "data": [
    {
      "id": 1,
      "title": "Post 1",
      "content": "Content 1",
      "createdAt": "2023-10-01T00:00:00.000Z"
    },
    {
      "id": 2,
      "title": "Post 2",
      "content": "Content 2",
      "createdAt": "2023-10-02T00:00:00.000Z"
    },
    ...
  ],
  // paging 관련 정보를 입력하는 곳
  "paging": {
    // 다음 커서에 대한 정보
    "cursor": {
      "after": 4,
    },
    // 총 몇개의 데이터가 응답되었는지
    "count": 20,
    // 다음 요청 URL
    "next": "http://localhost:3000/posts?order__createdAt=ASC&Where__id_more_then=4&take=20"
  }
}
```
