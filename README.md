# mstpubapi

認証なしでMastodonのタイムラインを覗いたり遡ったりするWebアプリです

他にも、認証なしでいろいろできるようにする予定です

## 使い方

設置済みのものは以下にあります
* https://mstpubapi.herokuapp.com

### Instance

インスタンス情報を参照します

### Timeline

インスタンスのタイムライン(ローカル/連合/タグ)を参照します。  
過去のタイムラインを遡ることもできます。

* Host  
    インスタンスホスト名(例: example.com)
* Type  
    タイムラインの種類  
    
    * local=ローカル
    * fera=連合
    * local-media=ローカルメディア ※メディアTLがあるインスタンスのみ
    * fera-media=連合メディア ※メディアTLがあるインスタンスのみ
    * その他の文字はタグタイムラインと認識されます
    
    さらに後ろに-sfwを付けると閲覧注意除外, -nsfwを付けると閲覧注意のみになります。
    
* Max  
    このステータスIDより前から表示開始する(max_id)  
    未指定や-1の場合には最新から表示されます
* Since  
    このステータスIDの手前まで表示する(since_id)  
    未指定や-1の場合には表示可能件数まで表示されます

* 新着  
    新着のみを表示します  
    41件以上新着があると間のものは取り逃します
* 最新に戻る  
    最新からの表示に戻ります
* 未来へ移動  
    表示開始日時を未来へ移動します  
    v2.0以降のID(9xxxxxxxxxxxxxxxxなど)の期間にいる場合のみ使用可能です
* 過去へ移動  
    表示開始日時を過去へ移動します  
    v2.0以降のID(9xxxxxxxxxxxxxxxxなど)の期間にいる場合のみ使用可能です
    
* 次ページ  
    表示中のステータスの次のページを表示します

### Streaming

インスタンスのタイムライン(ローカル/連合/タグ)を参照します。  
こちらは自動更新されます。

### Status

ステータス（トゥート）の様々な情報を参照します

### サイレンスチェッカー

インスタンスで特定のユーザーがサイレンスされているか調べます

## 実行方法

Node.js 8.x あたりで動きます  

    npm i

で依存モジュールをインストールした上で、実行/デプロイ/静的ファイルエクスポート 等を行ってください。

### 開発環境で実行

ローカル(http://localhost:3000) で起動します

    npm run dev

### 静的ファイルエクスポート

（Node.js ではない）通常のWebサーバー等でも動かせるように、静的ファイル(HTML, JS, CSS)としてエクスポートすることができます。  
以下のコマンドで out/ ディレクトリにファイルが出力されますので、中のファイルとディレクトリをWebサーバーに配置してください。  

    npm run export

いちおう、ローカルファイル(fileプロトコル)でも動くようです。(但し、将来的にサポートするかは未定)  
GitHub Pagesでは動かないかもしれない。

## その他

仕様とかバグとか実装メモとかTODOとかメモ書き

* 取得される情報は、ブラウザとインスタンス間でリアルタイムで直接通信して取得した情報。
    * このWebアプリの設置サーバーをデータは通過しないし、初期表示以外では通信もしない。
    * 削除されたアカウントやトゥートは取得できない。削除されたらタイムラインに抜けが出ていく。
    * インスタンスが落ちたり消えたりしたら取得できない。
* 認証不要のAPIのみを使用しているので、各インスタンスのアカウントはどこでも使用していない。

* 新着機能は、最新から(現在表示中のものの手前まで OR 40件に達するまで)表示するだけ。
    * 41件以上新着があったら抜けが出るので、恐らく多くの人が期待するものとは違う動作だと思う。

* 指定時間移動(未来/過去へ移動)機能は、v2.0以降のID(9xxxxxxxxxxxxxxxxなど)を時間と相互変換して演算して実装。
    * v2.0より前の部分のタイムラインを遡っている場合はうまく動かない。
    * もちろん v1.x なインスタンスの場合常に動かない。
        * ただしnicoとjpは v1.x区間のテーブルを持っているので動く

