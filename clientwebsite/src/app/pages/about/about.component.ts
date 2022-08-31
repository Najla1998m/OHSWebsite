import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StaticPagesService } from 'src/app/modules/core/services/static-pages.service';
import { StaticPages } from 'src/app/modules/shared/models/static-pages';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {
  page!: StaticPages;
  text = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Tellus cras adipiscing enim eu. Eget egestas purus viverra accumsan in. Leo a diam sollicitudin tempor id. Morbi tempus iaculis urna id volutpat. Aenean sed adipiscing diam donec. Orci a scelerisque purus semper eget duis at tellus at. Diam donec adipiscing tristique risus nec feugiat in fermentum. Aliquet sagittis id consectetur purus ut faucibus pulvinar elementum. Nunc sed augue lacus viverra vitae congue eu consequat. Eu lobortis elementum nibh tellus molestie nunc non. Tristique magna sit amet purus gravida quis blandit turpis. Duis ultricies lacus sed turpis tincidunt id. Orci phasellus egestas tellus rutrum tellus pellentesque. Tempus egestas sed sed risus pretium. Nulla facilisi etiam dignissim diam quis enim lobortis scelerisque. Risus quis varius quam quisque id diam. Tortor at auctor urna nunc id cursus. Sed egestas egestas fringilla phasellus.

  Eu tincidunt tortor aliquam nulla. Leo in vitae turpis massa sed elementum tempus egestas sed. Varius morbi enim nunc faucibus a pellentesque sit amet. Viverra maecenas accumsan lacus vel. Faucibus interdum posuere lorem ipsum dolor. Cursus euismod quis viverra nibh cras pulvinar mattis nunc. Feugiat in ante metus dictum at tempor. Mauris in aliquam sem fringilla. Consequat semper viverra nam libero justo laoreet. Ut sem viverra aliquet eget sit amet tellus cras adipiscing. Vitae sapien pellentesque habitant morbi tristique senectus et netus et. Imperdiet sed euismod nisi porta lorem mollis. In fermentum et sollicitudin ac orci phasellus egestas tellus. Mollis aliquam ut porttitor leo a. Facilisis leo vel fringilla est ullamcorper eget. Egestas fringilla phasellus faucibus scelerisque eleifend donec pretium vulputate sapien. Enim sit amet venenatis urna.
  
  Non odio euismod lacinia at. Tellus integer feugiat scelerisque varius morbi enim nunc faucibus. Tincidunt augue interdum velit euismod in pellentesque massa. Integer enim neque volutpat ac tincidunt vitae semper. Ac turpis egestas sed tempus urna et pharetra. Cursus vitae congue mauris rhoncus aenean vel. Porta nibh venenatis cras sed felis eget. Sed sed risus pretium quam vulputate dignissim. Leo vel orci porta non pulvinar neque laoreet suspendisse interdum. Proin libero nunc consequat interdum varius sit amet. At auctor urna nunc id cursus.
  
  Ullamcorper dignissim cras tincidunt lobortis feugiat vivamus at. Odio tempor orci dapibus ultrices in. Semper risus in hendrerit gravida rutrum quisque non. Arcu dui vivamus arcu felis bibendum ut tristique et egestas. Fames ac turpis egestas sed tempus. Euismod elementum nisi quis eleifend quam adipiscing. Pellentesque adipiscing commodo elit at imperdiet dui accumsan. Nibh tortor id aliquet lectus proin. Ullamcorper morbi tincidunt ornare massa eget egestas. Scelerisque eu ultrices vitae auctor. Ultrices gravida dictum fusce ut placerat orci. Sollicitudin ac orci phasellus egestas tellus rutrum tellus pellentesque. Eu consequat ac felis donec et odio pellentesque diam. Phasellus vestibulum lorem sed risus ultricies tristique nulla aliquet.
  
  Quisque id diam vel quam elementum pulvinar etiam non. Justo eget magna fermentum iaculis. Cursus eget nunc scelerisque viverra. Blandit cursus risus at ultrices mi tempus. Euismod lacinia at quis risus sed vulputate odio ut. Tempor commodo ullamcorper a lacus. Laoreet suspendisse interdum consectetur libero id. Iaculis nunc sed augue lacus viverra vitae. Aliquet enim tortor at auctor urna nunc id cursus metus. In cursus turpis massa tincidunt dui ut ornare. Parturient montes nascetur ridiculus mus mauris. Sollicitudin ac orci phasellus egestas tellus rutrum. Tortor consequat id porta nibh venenatis cras sed. Dolor sed viverra ipsum nunc aliquet.`;

  constructor(
    private staticPagesService: StaticPagesService,
    private ar: ActivatedRoute
  ) {}

  ngOnInit() {
    this.ar.params.subscribe((url) => {
      const id = url.id;
      this.staticPagesService.getPageById(id).subscribe((data: any) => {
        this.page = data;
        data;
      });
    });
  }
}
