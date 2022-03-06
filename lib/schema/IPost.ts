export interface IAuthor {
  nickname: string;
  avatarUrl: string;
}

export interface ITableData {
  key: string;
  value: string;
}

interface IPost {
  id: string;
  title: string;
  author: IAuthor;
  imageUrl: string;
  timestamp: string;
  tableData: ITableData[];
  body: string;
}

export default IPost;