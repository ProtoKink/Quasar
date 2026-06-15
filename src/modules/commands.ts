import { BaseModule, sendLocalMessage } from 'bc-deeplib/deeplib';

export class CommandsModule extends BaseModule {
	load(): void {
		CommandCombine([
			{
				Tag: 'quasar',
				Description: 'Quasar commands',
				Action: function () {
					CommandsHelp.ShowFor([this]);
				},
				Subcommands: [
					{
						Tag: 'wardrobe',
						Action: (args) => {
							const target = ChatRoomGetCharacter(args ?? '') ?? Player;
							ChatRoomAppearanceLoadCharacter(target);
						},
						Arguments: [{
							name: 'target',
							description: 'The target to load the character for',
							suggestions() {
								return [...new Set(ChatRoomCharacter.flatMap((character) =>
									[character.Name, character.Nickname, character.MemberNumber?.toString(), CharacterNickname(character)]
										.filter((x): x is string => x !== undefined && x !== null && x !== ''),
								))];
							},
						}]
					},
					{
						Tag: 'cum',
						Description: ': causes an orgasm.',
						Action: () => {
							ActivityOrgasmRuined = false;
							ActivityOrgasmStart(Player);
						}
					},
					{
						Tag: 'mapfog',
						Description: ': toggles fog in current mapped room.',
						Action: () => {
							if (!ChatRoomData?.MapData) return;

							ChatRoomData.MapData.Fog = !ChatRoomMapFogIsActive();
							const status = ChatRoomMapFogIsActive() ? 'disabled' : 'enabled';
							ChatRoomSendLocal(`Fog in current mapped room is ${status}. No visible effect if you have enabled full vision in mapped rooms.`);
						}
					},
					{
						Tag: 'leave',
						Description: ': leaves the current room and returns to the chat search screen.',
						Action: () => {
							if (PandoraPenitentiaryIsInmate(Player)) {
								if (Player.Game?.Prison) {
									Player.Game.Prison.Timer = Math.round(CurrentTime);
									ServerAccountUpdate.QueueData({
										Game: Player.Game
									}, true);
								}
							}
							ChatRoomLeave();
							CommonSetScreen('Online', 'ChatSearch');
						}
					},
					{
						Tag: 'relog',
						Description: ': relogins you to the server.',
						Action: () => {
							ServerSocket.close();
							ServerSocket.open();
						}
					},
					{
						Tag: 'removeitem',
						Description: ': removes a specific item from selected character.',
						Action: () => {
							sendLocalMessage(
								'removeitem-5-sec-notice',
								`<p style='background-color:#000452;color:#EEEEEE'>Quasar:
								<br>You have 5 seconds to click  on target, select area. If successful, will be returned. If not, retry.</p>`,
								5
							);
							setTimeout(function () {
								if (!CurrentCharacter) return sendLocalMessage(
									'removeitem-no-character-selected',
									`<p style='background-color:#000452;color:#EEEEEE'>Quasar:
									<br>No character selected. Try again.</p>`.replaceAll('\n', ''),
									5
								);
								if (!CurrentCharacter.FocusGroup) {
									DialogLeave();
									return sendLocalMessage(
										'removeitem-focus-group-not-found',
										`<p style='background-color:#000452;color:#EEEEEE'>Quasar:
										<br>Focus group not found. Try again.</p>`.replaceAll('\n', ''),
										5
									);
								}
								if (!InventoryGet(CurrentCharacter, CurrentCharacter.FocusGroup.Name)) {
									DialogLeave();
									return sendLocalMessage(
										'removeitem-item-not-found',
										`<p style='background-color:#000452;color:#EEEEEE'>Quasar:
										<br>Item not found. Try again.</p>`.replaceAll('\n', ''),
										5
									);
								}

								if (CurrentCharacter !== Player) {
									if (!CurrentCharacter.AllowItem) return sendLocalMessage(
										'removeitem-allow-item-false',
										`<p style='background-color:#000452;color:#EEEEEE'>Quasar:
										<br>You are not allowed to remove items from this character. Try again.</p>`.replaceAll('\n', ''),
										5
									);
									const item = InventoryGet(CurrentCharacter, CurrentCharacter.FocusGroup.Name);
									if (!item) return;
									ServerSend('ChatRoomChat', {
										Content: `Quasar: ${Player.Name} has removed ${item.Asset.Name} on you via console. If this is undesired, blacklist player.`,
										Type: 'Whisper',
										Target: CurrentCharacter.MemberNumber
									});
								};

								InventoryRemove(CurrentCharacter, CurrentCharacter.FocusGroup.Name);
								ChatRoomCharacterUpdate(CurrentCharacter);
								DialogLeave();
							}, 5000);
						}

					}
				]
			},
			{
				Tag: 'q',
				Reference: 'quasar',
			}
		]);
	}
}
