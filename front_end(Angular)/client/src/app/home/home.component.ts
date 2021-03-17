import { Component, OnInit } from '@angular/core';

declare var $:any
declare var toastr:any

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  books: any[] = [];
  loading = true;

  directoryList: any[] = [];
    currentFileData: any;
    path: any;

  constructor() {}


  ngOnInit() {

      $('#searchForm').form({
          on: 'blur',
          fields: {
              text     : 'empty',
          }, onSuccess: (event: any, fields: any) => {
                console.log(fields.text)
                let url = 'http://localhost:8081/graphql';
              let path = fields.text
              this.path = fields.text;

              fetch( url, {
                  method : 'POST',
                  headers: {
                      'Content-Type': `application/json`,
                      'Accept'      : `application/json`
                  },
                  body: JSON.stringify( {
                      query: `{
                            getFullDirectoryListing(path:"${path}") {
                                id,
                                fileName,
                                fileSize,
                                createdDate,
                                permission,
                                isDirectory
                            }
                        }`
                  })
              }).then( response => response.json()).then( response => {
                  this.directoryList = response?.data?.getFullDirectoryListing;

                  console.log(this.directoryList)
                  if(this.directoryList == null){
                      toastr.error("Directory Not found","Error");
                  }else {
                      toastr.success("Directory found","Success");
                  }
              }).catch(error=>{
                  toastr.error("Directory Not found","Error");
              });
          }
      });


  }

    openDataModal(d: any) {
        this.currentFileData = d;
        $('#moreDataModal').modal('show');
    }
}
