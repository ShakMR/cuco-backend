import { ResponseDto } from '../dto/response.dto';
import { Transformer } from './transformer';

class MetaDto {}

export class ResponseListTransformer<Input, Output>
  implements Transformer<Input[], ResponseDto<Output[]>, MetaDto>
{
  constructor(private itemTransformer: Transformer<Input, Output>) {}

  transform(list: Input[], meta?: MetaDto): ResponseDto<Output[]> {
    return {
      data: list.map((item) => this.itemTransformer.transform(item)),
      meta,
    };
  }
}
