import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { constants } from '../../app/constants';
import { Oferta } from '../../app/models/oferta.model';
import { OfertaPage } from '../oferta/oferta';
import { FeiraPage } from '../feira/feira';
import { OfertaProvider } from '../../providers/oferta/oferta.provider';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { LikeProvider } from '../../providers/like/like.provider';
import { Like } from '../../app/models/like.model'
import {User} from "../../app/models/user.model";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  animations: [
    trigger('userLiked', [
      state('true', style({
        color: '#FF5722',
        transform: 'scale(1.1)'
      })),
      state('false',   style({
        color: '#757575',
        transform: 'scale(1)'
      })),
      transition('false => true', animate('100ms ease-in')),
      transition('true => false', animate('100ms ease-out'))
    ])
  ]
})
export class HomePage {

  items: Oferta[];
  items_backup: Oferta[];
  title = constants.APP_NAME;
  user: User;

  constructor(public navCtrl: NavController,
              private platform: Platform,
              private ofertaProvider: OfertaProvider,
              private likeProvider: LikeProvider) {

    this.ofertaProvider.ofertas()
      .subscribe((ofertas: Oferta[]) => {
          this.items = ofertas;
          this.items_backup = this.items;
        },
        error => {
          console.error('Unable to get data: '  + JSON.stringify(error));
        });
  }

  ionViewCanEnter() {
  }

  toggleLikeState(oferta : Oferta) {
    let like = new Like();
    like.oferta_id = oferta.id;

    oferta.toggleLikeState();

    if(!oferta.liked) {
      this.likeProvider.removeLike(like)
        .subscribe(data => {
          console.log(data);
        }, error => {
          console.error(JSON.stringify(error));
        });
    } else {
      this.likeProvider.addLike(like)
        .subscribe(data => {
          console.log(data)
        }, error => {
          console.error(JSON.stringify(error));
        });
    }
  }

  goToOfertaPage(id : number) {
    this.navCtrl.push(OfertaPage, { id: id });
  }

  goToFeiraPage(id : number) {
    this.navCtrl.push(FeiraPage, { id: id });
  }

  getItems(ev: any) {
    this.items = this.items_backup;
    let val = ev.target.value;
    if (val && val.trim() != '' && this.items) {
      this.items = this.items.filter((item) => {
        return (item.produto_nome.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }
}
